import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext.tsx";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { Button } from "../components/Button";
import { ChevronDown, Users, Map as MapIcon, Drone, ScanEye, MapPin, Clock, ArrowRight, Activity, Zap, ShieldCheck } from "lucide-react";
import { Card } from "../components/Card";
import { useNavigate } from "react-router";
// @ts-ignore
import Map, { Marker } from "react-map-gl/maplibre";

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
const MAP_STYLE_LIGHT = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

interface Sighting {
  id: number;
  photoFilename: string;
  status: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  source: "user" | "drone";
  droneId: number;
}

export function OverviewPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    drones: "12/16",
    zones: 0,
    users: 0,
    sightings: 0,
  });

  const [recentSightings, setRecentSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      try {
        const [usersRes, zonesRes, sightingsRes] = await Promise.all([
          fetch('http://localhost:8080/api/admin/users', { headers }),
          fetch('http://localhost:8080/api/admin/zones', { headers }),
          fetch('http://localhost:8080/api/admin/sightings/filter?timeframe=all', { headers })
        ]);

        const usersData = await usersRes.json();
        const zonesData = await zonesRes.json();
        const sightingsData = await sightingsRes.json();

        setStats(prev => ({
          ...prev,
          users: Array.isArray(usersData) ? usersData.length : 0,
          zones: Array.isArray(zonesData) ? zonesData.length : 0,
          sightings: Array.isArray(sightingsData) ? sightingsData.length : 0,
        }));

        if (Array.isArray(sightingsData)) {
          const sorted = sightingsData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          setRecentSightings(sorted.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching overview data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatSmartTime = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInMs = now.getTime() - past.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMins / 60);

    if (diffInMins < 1) return "Just now";
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return past.toLocaleDateString([], { month: 'short', day: '2-digit' });
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toLowerCase() || "new";
    const styles: Record<string, string> = {
      new: "bg-orange-500/10 text-orange-600 border border-orange-500/20",
      verified: "bg-red-500/10 text-red-600 border border-red-500/20",
      neglected: "bg-green-500/10 text-green-600 border border-green-500/20",
    };
    return styles[normalizedStatus] || "bg-gray-500/10 text-gray-600 border border-gray-500/20";
  };

  const mapCenter = recentSightings.length > 0 
    ? { longitude: recentSightings[0].longitude, latitude: recentSightings[0].latitude }
    : { longitude: 80.7718, latitude: 7.8731 };

  return (
      <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
        
        {/* HERO SECTION */}
        <div className={`p-8 rounded-[24px] relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6 ${
          isDark 
            ? "bg-gradient-to-br from-blue-900/40 via-black to-indigo-900/40 border border-white/10" 
            : "bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white shadow-xl shadow-blue-500/20"
        }`}>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

          <div className="relative z-10 space-y-2">
            <h1 className={`text-3xl md:text-4xl font-bold tracking-tight ${isDark ? "text-white" : "text-white"}`}>
              Welcome back, Admin
            </h1>
            <p className={`text-sm md:text-base ${isDark ? "text-blue-200/70" : "text-blue-100/90"}`}>
              Here's what's happening across the wildlife monitoring network today.
            </p>
          </div>
          
          <div className="relative z-10 flex items-center gap-3 bg-black/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
            <Clock className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-200"}`} />
            <span className={`font-medium ${isDark ? "text-white" : "text-white"}`}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card className={`group hover:scale-[1.02] transition-all duration-300 ${isDark ? "bg-white/[0.02]" : "bg-white hover:shadow-xl hover:shadow-blue-500/10"}`}>
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                <Drone className="w-6 h-6" />
              </div>
              <div>
                <p className={`text-sm font-medium ${isDark ? "text-white/50" : "text-gray-500"}`}>Active Drones</p>
                <p className="text-2xl font-bold">{stats.drones}</p>
              </div>
            </div>
          </Card>

          <Card className={`group hover:scale-[1.02] transition-all duration-300 ${isDark ? "bg-white/[0.02]" : "bg-white hover:shadow-xl hover:shadow-indigo-500/10"}`}>
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                <MapIcon className="w-6 h-6" />
              </div>
              <div>
                <p className={`text-sm font-medium ${isDark ? "text-white/50" : "text-gray-500"}`}>Monitored Zones</p>
                <p className="text-2xl font-bold">{loading ? "..." : stats.zones}</p>
              </div>
            </div>
          </Card>

          <Card className={`group hover:scale-[1.02] transition-all duration-300 ${isDark ? "bg-white/[0.02]" : "bg-white hover:shadow-xl hover:shadow-emerald-500/10"}`}>
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className={`text-sm font-medium ${isDark ? "text-white/50" : "text-gray-500"}`}>Registered Users</p>
                <p className="text-2xl font-bold">{loading ? "..." : stats.users}</p>
              </div>
            </div>
          </Card>

          <Card className={`group hover:scale-[1.02] transition-all duration-300 ${isDark ? "bg-white/[0.02]" : "bg-white hover:shadow-xl hover:shadow-orange-500/10"}`}>
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                <ScanEye className="w-6 h-6" />
              </div>
              <div>
                <p className={`text-sm font-medium ${isDark ? "text-white/50" : "text-gray-500"}`}>Total Sightings</p>
                <p className="text-2xl font-bold">{loading ? "..." : stats.sightings}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* MAIN DASHBOARD CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT: ACTIVITY FEED */}
          <Card className="lg:col-span-2 flex flex-col p-0 overflow-hidden">
            <div className={`px-6 py-5 border-b ${isDark ? "border-white/10" : "border-gray-100"} flex items-center justify-between bg-black/[0.02]`}>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold">Live Alert Feed</h2>
              </div>
              <Button variant="ghost" className="text-sm font-semibold text-blue-500 hover:text-blue-600" onClick={() => navigate('/sighting-alerts')}>
                View All <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>

            <div className="p-6 flex-1">
              <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[23px] before:w-[2px] before:bg-gradient-to-b before:from-blue-500/50 before:to-transparent">
                {loading ? (
                  <div className="p-8 text-center text-sm opacity-50 animate-pulse">Loading recent activity...</div>
                ) : recentSightings.length > 0 ? (
                  recentSightings.map((sighting) => (
                      <div key={sighting.id} className={`relative pl-14 transition-all duration-300 group cursor-pointer`} onClick={() => navigate(`/sighting-alerts/${sighting.id}`)}>
                        {/* Timeline Node */}
                        <div className={`absolute left-0 top-1.5 w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 ${
                          isDark ? "border-[#0B1120]" : "border-white"
                        } ${sighting.source === 'drone' ? "bg-blue-500" : "bg-orange-500"} text-white z-10 group-hover:scale-110 transition-transform`}>
                          {sighting.source === 'drone' ? <Drone className="w-5 h-5" /> : <ScanEye className="w-5 h-5" />}
                        </div>

                        {/* Content Card */}
                        <div className={`p-4 rounded-2xl border transition-all duration-300 ${
                          isDark 
                            ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10" 
                            : "bg-gray-50 border-gray-100 hover:bg-white hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200"
                        }`}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold text-base flex items-center gap-2">
                                {sighting.source === 'drone' ? `Drone Unit #${sighting.droneId} Alert` : 'Citizen Sighting Report'}
                              </h3>
                              <div className={`text-xs mt-1 font-medium ${isDark ? "text-white/40" : "text-gray-500"} flex items-center gap-1.5`}>
                                <Clock className="w-3.5 h-3.5" /> {formatSmartTime(sighting.timestamp)}
                              </div>
                            </div>
                            <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-lg ${getStatusBadge(sighting.status)}`}>
                              {sighting.status || 'NEW'}
                            </span>
                          </div>
                          
                          <div className={`mt-3 text-sm flex items-center gap-2 ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                            <MapPin className="w-4 h-4" /> 
                            <span className="font-mono bg-blue-500/10 px-2 py-0.5 rounded text-xs">
                              {sighting.latitude.toFixed(4)}, {sighting.longitude.toFixed(4)}
                            </span>
                          </div>
                        </div>
                      </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-sm opacity-50">No recent sightings logged.</div>
                )}
              </div>
            </div>
          </Card>

          {/* RIGHT: MAP & QUICK ACTIONS */}
          <div className="flex flex-col gap-6">
            
            {/* MINI MAP */}
            <Card className="p-0 overflow-hidden flex flex-col h-[320px] shadow-lg relative group">
              <div className={`absolute top-0 inset-x-0 z-10 px-4 py-3 bg-gradient-to-b ${isDark ? "from-black/80 to-transparent" : "from-white/80 to-transparent"} pointer-events-none flex justify-between items-center`}>
                <span className="text-sm font-bold flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500" /> Latest Sightings Map</span>
              </div>
              
              <div className="flex-1 w-full relative">
                {!loading && (
                  <Map
                    initialViewState={{ longitude: mapCenter.longitude, latitude: mapCenter.latitude, zoom: 9 }}
                    mapStyle={isDark ? MAP_STYLE : MAP_STYLE_LIGHT}
                    style={{ width: "100%", height: "100%" }}
                    interactive={false}
                  >
                    {recentSightings.map((pt, i) => (
                      <Marker key={`sighting-${i}`} longitude={pt.longitude} latitude={pt.latitude} anchor="center">
                        <div className="relative flex items-center justify-center">
                          <div className={`absolute w-8 h-8 rounded-full opacity-40 animate-ping ${pt.source === 'drone' ? "bg-blue-500" : "bg-orange-500"}`}></div>
                          <div className={`w-4 h-4 rounded-full shadow-lg border-2 border-white z-10 ${pt.source === 'drone' ? "bg-blue-500" : "bg-orange-500"}`} />
                        </div>
                      </Marker>
                    ))}
                  </Map>
                )}
              </div>
              
              <div className="absolute bottom-0 inset-x-0 z-10 p-3 bg-gradient-to-t from-black/60 to-transparent flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" className="text-sm font-medium" onClick={() => navigate('/alert-map')}>
                  Open Full Map
                </Button>
              </div>
            </Card>

            {/* SYSTEM QUICK ACTIONS */}
            <Card className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 opacity-60">
                <Zap className="w-4 h-4" /> Quick Actions
              </h3>
              
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/geofencing')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:-translate-y-1 ${
                    isDark 
                      ? "bg-white/[0.02] border-white/5 hover:bg-indigo-500/10 hover:border-indigo-500/30" 
                      : "bg-gray-50 border-gray-100 hover:bg-indigo-50 hover:border-indigo-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500 text-white"><ShieldCheck className="w-4 h-4" /></div>
                    <span className="font-semibold text-sm">Manage Geofences</span>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-30" />
                </button>
                
                <button 
                  onClick={() => navigate('/live-monitor')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:-translate-y-1 ${
                    isDark 
                      ? "bg-white/[0.02] border-white/5 hover:bg-blue-500/10 hover:border-blue-500/30" 
                      : "bg-gray-50 border-gray-100 hover:bg-blue-50 hover:border-blue-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500 text-white"><Drone className="w-4 h-4" /></div>
                    <span className="font-semibold text-sm">Drone Live Monitor</span>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-30" />
                </button>
              </div>
            </Card>

          </div>
        </div>
      </div>
  );
}