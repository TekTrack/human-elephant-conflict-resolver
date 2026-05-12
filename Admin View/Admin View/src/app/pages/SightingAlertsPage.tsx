import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext.tsx";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  X,
  Video,
  Check,
  MapPin,
  ScanEye,
  CheckLine,
  ClockPlus, Drone
} from "lucide-react";
import { useMapTrigger } from "../context/MapTriggerContext.tsx";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { useNavigate, useParams } from "react-router";
import { StatCard } from "../components/StatCard.tsx";
import { PageHeader } from "../components/PageHeader.tsx";

type FilterValue = "all" | "hour" | "day" | "week";

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

interface Alert {
  id: number;
  title: string;
  description: string;
  status: string;
  time: string;
  location: string;
  rawTime: string;
  sighting: Sighting;
}

export function SightingAlertsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [sightings, setSightings] = useState<Sighting[]>();
  const [filter, setFilter] = useState("all");
  const [processingId, setProcessingId] = useState<number | null>(null);
  
  const [activeTab, setActiveTab] = useState<"user" | "drone">("user");

  const { BASE_URL, mapTrigger } = useMapTrigger();

  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const navigate = useNavigate();
  const { sightingId } = useParams<{ sightingId: string }>();

  const fetchSightings = async (filter: FilterValue) => {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${BASE_URL}/sightings/filter?timeframe=${filter}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    setSightings(data);
    showSightings(data);
  };

  useEffect(() => {
    const currentSighting = alerts.find(s => s.id === Number(sightingId));
    setSelectedAlert(currentSighting || null);
  }, [sightingId, alerts]);

  useEffect(() => {
    fetchSightings(filter as FilterValue);
  }, [filter, mapTrigger]);

  const formatSmartTime = (timestamp: number | string | Date) => {
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

  const showSightings = async (sightings: Sighting[]) => {
    const alertSet = sightings.map((sighting) => ({
      id: sighting.id,
      time: formatSmartTime(sighting.timestamp),
      title: sighting.source === "drone" ? `DRONE Sighting!` : `USER Sighting!`,
      description: sighting.source === "drone" 
        ? `Critical: Drone No: ${sighting.droneId} has identified an elephant!` 
        : `Warning: Elephant sighting by an app user. Check Details!`,
      status: sighting.status || "new",
      location: `Latitude : ${sighting.latitude} , Longitude : ${sighting.longitude} `,
      rawTime: sighting.timestamp,
      sighting: sighting
    }));
    setAlerts(alertSet);
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "verified":
        return < XCircle className="w-5 h-5 text-red-500" />;
      case "new":
        return <ClockPlus className="w-5 h-5 text-orange-500" />;
      case "info":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "neglected":
        return < CheckLine className="w-5 h-5 text-green-500"/>;
      default:
        return <ClockPlus className="w-5 h-5 text-orange-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toLowerCase() || "new";
    const styles: Record<string, string> = {
      critical: "bg-red-100 text-red-700",
      warning: "bg-yellow-100 text-yellow-700",
      new: "bg-blue-100 text-blue-700",
      info: "bg-blue-100 text-blue-700",
      neglected: "bg-green-100 text-green-700",
      verified: "bg-red-100 text-red-700",
    };
    return styles[normalizedStatus] || "bg-gray-100 text-gray-700";
  };

  const getAlertCount = (type: string, source: "user" | "drone") => {
    const sourceAlerts = alerts.filter(a => a.sighting.source === source);
    if (type === "total") return sourceAlerts.length;
    if (type === "new") return sourceAlerts.filter(a => a.status === "new").length;
    if (type === "verified") return sourceAlerts.filter(a => a.status === "verified").length;
    if (type === "neglected") return sourceAlerts.filter(a => a.status === "neglected").length;
    return 0;
  };

  const verifySighting = async (id: number) => {
    if (!window.confirm("Are you sure you want to VERIFY this sighting?")) return;
    
    setProcessingId(id);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}/sightings/verify/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert("Sighting verified successfully!");
        setSelectedAlert(null);
        fetchSightings(filter as FilterValue); 
      } else {
        console.error("Failed to verify sighting. Status:", response.status);
      }
    } catch (error) {
      console.error("Error verifying sighting:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const neglectSighting = async (id: number) => {
    if (!window.confirm("Are you sure you want to NEGLECT and resolve this sighting?")) return;
    
    setProcessingId(id);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}/sightings/neglect/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert("Sighting neglected and resolved!");
        setSelectedAlert(null);
        fetchSightings(filter as FilterValue); 
      } else {
        console.error("Failed to neglect sighting. Status:", response.status);
      }
    } catch (error) {
      console.error("Error neglecting sighting:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const InfoItem = ({ label, value, isDark, action }: { label: string; value: React.ReactNode; isDark: boolean; action?: React.ReactNode }) => (
    <div className={`flex items-center justify-between p-3 rounded-xl border ${isDark ? "bg-white/[0.04] border-white/[0.06]" : "bg-gray-50 border-gray-100"}`}>
      <div className={`flex-1 min-w-0 ${action ? 'pr-2' : ''}`}>
        <p className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${isDark ? "text-white/40" : "text-gray-400"}`}>{label}</p>
        <div className={`text-xs break-all ${isDark ? "text-white/85" : "text-gray-800"}`}>{value}</div>
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );

  const userAlerts = alerts.filter(a => a.sighting.source === "user");
  const droneAlerts = alerts.filter(a => a.sighting.source === "drone");

  return (
    <div className="p-8 space-y-6">

      <PageHeader
        title="Sighting Alerts"
        description="Monitor real-time elephant sightings from all sources"
      />

      {/* HIGHLIGHTED TABS SWITCHER */}
      <div className={`flex p-1.5 space-x-2 rounded-xl w-fit ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
        <button
          onClick={() => setActiveTab("user")}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === "user"
              ? "bg-blue-500 text-white shadow-md transform scale-[1.02]"
              : isDark ? "text-white/50 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/80"
            }`}
        >
          <ScanEye className="w-4 h-4" />
          User Sightings
        </button>
        <button
          onClick={() => setActiveTab("drone")}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === "drone"
              ? "bg-blue-500 text-white shadow-md transform scale-[1.02]"
              : isDark ? "text-white/50 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/80"
            }`}
        >
          <Drone className="w-4 h-4" />
          Drone Alerts
        </button>
      </div>

      {/* ================= USER TAB CONTENT ================= */}
      {activeTab === "user" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard label={"Total User Sightings"} value={getAlertCount("total", "user")} icon={<ScanEye />} iconBgClass="bg-blue-500 text-white" />
            <StatCard label={"Resolved User Sightings"} value={getAlertCount("neglected", "user")} icon={<CheckLine />} iconBgClass="bg-green-500 text-white" />
            <StatCard label={"Verified User Sightings"} value={getAlertCount("verified", "user")} icon={<X />} iconBgClass="bg-red-500 text-white" />
            <StatCard label={"New User Sightings"} value={getAlertCount("new", "user")} icon={<ClockPlus />} iconBgClass="bg-orange-500 text-white" />
          </div>

          <div className="space-y-3">
            {userAlerts.length > 0 ? (
              userAlerts
                .sort((a, b) => new Date(b.rawTime).getTime() - new Date(a.rawTime).getTime())
                .map((alert) => {
                  // 1. Check the status right here, INSIDE the loop
                  const isNew = alert.status?.toLowerCase() === "new";

                  return (
                    <div
                      key={alert.id}
                      onClick={() => setSelectedAlert(alert)}
                      // 2. Apply the dynamic background colors to the outermost card
                      className={`p-5 rounded-xl border transition-colors cursor-pointer ${
                        isNew
                          ? isDark
                            ? "bg-blue-500/10 border-blue-500/20" // Dark Mode: Subtle blue tint
                            : "bg-blue-50 border-blue-200 shadow-sm" // Light Mode: Soft blue tint
                          : isDark
                          ? "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)]" // Dark Mode: Normal
                          : "bg-white border-gray-200 hover:bg-gray-50" // Light Mode: Normal
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {getStatusIcon(alert.status)}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold">{alert.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(alert.status)}`}>
                              {alert.status.toUpperCase()}
                            </span>
                          </div>
                          <p className={`text-sm mb-2 ${isDark ? "text-[rgba(255,255,255,0.6)]" : "text-gray-600"}`}>
                            {alert.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs">
                            <span className={isDark ? "text-[rgba(255,255,255,0.4)]" : "text-gray-500"}>
                              {alert.time}
                            </span>
                            <span className={isDark ? "text-[rgba(255,255,255,0.4)]" : "text-gray-500"}>
                              📍 {alert.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className={`p-8 text-center rounded-xl border border-dashed ${isDark ? "border-white/10 text-white/40" : "border-gray-200 text-gray-500"}`}>
                No user sightings found.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= DRONE TAB CONTENT ================= */}
      {activeTab === "drone" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard label={"Total Drone Sightings"} value={getAlertCount("total", "drone")} icon={<Drone />} iconBgClass="bg-blue-500 text-white" />
            <StatCard label={"Checked Drone Sightings"} value={getAlertCount("neglected", "drone")} icon={<CheckLine />} iconBgClass="bg-green-500 text-white" />
            <StatCard label={"New Drone Sightings"} value={getAlertCount("new", "drone")} icon={<ClockPlus />} iconBgClass="bg-orange-500 text-white" />
          </div>

          <div className="space-y-3">
            {droneAlerts.length > 0 ? (
              droneAlerts
                .sort((a, b) => new Date(b.rawTime).getTime() - new Date(a.rawTime).getTime())
                .map((alert) => {
                  // 1. Check the status right here, INSIDE the loop
                  const isNew = alert.status?.toLowerCase() === "new";

                  return (
                    <div
                      key={alert.id}
                      onClick={() => setSelectedAlert(alert)}
                      // 2. Apply the dynamic background colors to the outermost card
                      className={`p-5 rounded-xl border transition-colors cursor-pointer ${
                        isNew
                          ? isDark
                            ? "bg-blue-500/10 border-blue-500/20" // Dark Mode: Subtle blue tint
                            : "bg-blue-50 border-blue-200 shadow-sm" // Light Mode: Soft blue tint
                          : isDark
                          ? "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)]" // Dark Mode: Normal
                          : "bg-white border-gray-200 hover:bg-gray-50" // Light Mode: Normal
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {getStatusIcon(alert.status)}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold">{alert.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(alert.status)}`}>
                              {alert.status.toUpperCase()}
                            </span>
                          </div>
                          <p className={`text-sm mb-2 ${isDark ? "text-[rgba(255,255,255,0.6)]" : "text-gray-600"}`}>
                            {alert.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs">
                            <span className={isDark ? "text-[rgba(255,255,255,0.4)]" : "text-gray-500"}>
                              {alert.time}
                            </span>
                            <span className={isDark ? "text-[rgba(255,255,255,0.4)]" : "text-gray-500"}>
                              📍 {alert.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className={`p-8 text-center rounded-xl border border-dashed ${isDark ? "border-white/10 text-white/40" : "border-gray-200 text-gray-500"}`}>
                No drone sightings found.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sighting Details Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedAlert(null)} />

          <Card className={`relative w-full max-w-2xl shadow-2xl z-10 border ${isDark ? "border-white/10" : "border-gray-200"} max-h-[90vh] overflow-y-auto custom-scrollbar`} noPadding={true}>
            <div className="p-6 space-y-5">
              <div className={`flex items-center justify-between border-b pb-4 ${isDark ? "border-white/10" : "border-gray-200"}`}>
                <div>
                  <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Sighting Details</h2>
                  <p className={`text-xs uppercase tracking-tighter mt-1 ${isDark ? "text-white/50" : "text-gray-500"}`}>Full Sighting Information and Image</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded ${getStatusBadge(selectedAlert.status)}`}>
                    {selectedAlert.status}
                  </span>
                  <button onClick={() => setSelectedAlert(null)} className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-white/50" : "hover:bg-gray-100 text-gray-400"}`}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? "bg-white/5 text-white/50" : "bg-gray-100 text-gray-500"}`}>
                  {getStatusIcon(selectedAlert.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-base truncate ${isDark ? "text-white" : "text-gray-900"}`}>{selectedAlert.title}</p>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-white/50" : "text-gray-500"}`}>
                    {selectedAlert.description}
                  </p>
                </div>
                <div className={`text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 uppercase tracking-widest ${isDark ? "bg-white/5 text-white/40" : "bg-gray-100 text-gray-500"}`}>
                  ID: {selectedAlert.sighting.id}
                </div>
              </div>

              <div>
                <p className={`text-[9px] font-bold uppercase tracking-widest mb-2 ${isDark ? "text-white/40" : "text-gray-400"}`}>Information</p>
                <div className="grid grid-cols-2 gap-3">
                  <InfoItem
                    label="Location"
                    value={selectedAlert.location}
                    isDark={isDark}
                    action={
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents click from bubbling up
                          if (selectedAlert.sighting.latitude && selectedAlert.sighting.longitude) {
                            // 👇 Added sightingId to the URL so the map page knows to isolate this pin!
                            navigate(`/geofencing?lat=${selectedAlert.sighting.latitude}&lng=${selectedAlert.sighting.longitude}&sightingId=${selectedAlert.sighting.id}`);
                          }
                        }}
                        className={`p-1.5 rounded-lg transition-colors border disabled:opacity-50 disabled:cursor-not-allowed ${
                          isDark 
                            ? "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300" 
                            : "bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-600 hover:text-blue-700"
                        }`}
                        title="View on Map"
                        aria-label="View location on map"
                        disabled={!selectedAlert.sighting.latitude || !selectedAlert.sighting.longitude}
                      >
                        <MapPin className="w-4 h-4" />
                      </button>
                    }
                  />
                  <InfoItem label="Time" value={new Date(selectedAlert.sighting.timestamp).toLocaleString()} isDark={isDark} />
                  <InfoItem
                    label="Source"
                    value={<span className="capitalize">{selectedAlert.sighting.source}</span>}
                    isDark={isDark}
                    action={
                      selectedAlert.sighting.source === "drone" && (
                        <button
                          onClick={() => navigate(`/live-monitor/${selectedAlert.sighting.droneId}`)}
                          className={`p-1.5 rounded-lg transition-colors border ${isDark ? "bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400 hover:text-red-300" : "bg-red-50 border-red-200 hover:bg-red-100 text-red-600 hover:text-red-700"}`}
                          title="View Live Feed"
                        >
                          <Video className="w-4 h-4" />
                        </button>
                      )
                    }
                  />
                  <InfoItem label="Status" value={selectedAlert.sighting.status ? selectedAlert.sighting.status.toUpperCase() : "NEW"} isDark={isDark} />
                </div>
              </div>

              <div className={`w-full rounded-xl flex items-center justify-center overflow-hidden min-h-[300px] border ${isDark ? "bg-black/20 border-white/5" : "bg-gray-50 border-gray-200"}`}>
                <img
                  src={`${selectedAlert.sighting.photoFilename}`}
                  alt="Sighting Image"
                  className="w-full h-auto object-contain max-h-[400px]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent && !parent.querySelector('.fallback-text')) {
                      const placeholder = document.createElement('div');
                      placeholder.className = `text-center py-10 fallback-text text-[11px] font-bold uppercase tracking-widest ${isDark ? "text-white/30" : "text-gray-400"}`;
                      placeholder.innerText = 'Image API pending or image not found';
                      parent.appendChild(placeholder);
                    }
                  }}
                />
              </div>

              <div className={`flex items-center gap-3 pt-4 border-t ${isDark ? "border-white/10" : "border-gray-200"}`}>
                <Button variant="secondary" className="flex-1" onClick={() => setSelectedAlert(null)}>
                  <X className="w-4 h-4 mr-2 inline" /> Close
                </Button>

                {selectedAlert.sighting.source === "drone" ? (
                  <>
                    {/* DRONE TAB: NEGLECT BUTTON (Green) */}
                    <Button 
                      variant="secondary" 
                      className={`flex-1 transition-all disabled:cursor-not-allowed disabled:shadow-none disabled:!border-transparent ${
                        isDark 
                          ? "enabled:bg-green-500/10 enabled:text-green-400 enabled:hover:bg-green-500/20 disabled:!bg-white/5 disabled:!text-white/30" 
                          : "enabled:bg-green-50 enabled:text-green-600 enabled:hover:bg-green-100 disabled:!bg-gray-100 disabled:!text-gray-400"
                      }`}
                      onClick={() => neglectSighting(selectedAlert.sighting.id)}
                      disabled={processingId === selectedAlert.sighting.id || selectedAlert.status === "neglected" || selectedAlert.status === "verified"}
                    >
                      <XCircle className="w-4 h-4 mr-2 inline" /> 
                      {processingId === selectedAlert.sighting.id ? "Processing..." : "Neglect"}
                    </Button>

                    {/* DRONE TAB: VIEW DRONE BUTTON (Red style) */}
                    <Button 
                      variant="secondary" 
                      className={`flex-1 transition-all disabled:cursor-not-allowed disabled:shadow-none disabled:!border-transparent ${
                        isDark 
                          ? "enabled:bg-red-500/10 enabled:text-red-400 enabled:hover:bg-red-500/20 disabled:!bg-white/5 disabled:!text-white/30" 
                          : "enabled:bg-red-50 enabled:text-red-600 enabled:hover:bg-red-100 disabled:!bg-gray-100 disabled:!text-gray-400"
                      }`}
                      onClick={() => navigate(`/live-monitor/${selectedAlert.sighting.droneId}`)}
                    >
                      <Video className="w-4 h-4 mr-2 inline" /> 
                      View Drone
                    </Button>
                  </>
                ) : (
                  <>
                    {/* USER TAB: NEGLECT BUTTON (Green) */}
                    <Button 
                      variant="secondary" 
                      className={`flex-1 transition-all disabled:cursor-not-allowed disabled:shadow-none disabled:!border-transparent ${
                        isDark 
                          ? "enabled:bg-green-500/10 enabled:text-green-400 enabled:hover:bg-green-500/20 disabled:!bg-white/5 disabled:!text-white/30" 
                          : "enabled:bg-green-50 enabled:text-green-600 enabled:hover:bg-green-100 disabled:!bg-gray-100 disabled:!text-gray-400"
                      }`}
                      onClick={() => neglectSighting(selectedAlert.sighting.id)}
                      disabled={processingId === selectedAlert.sighting.id || selectedAlert.status === "neglected" || selectedAlert.status === "verified"}
                    >
                      <XCircle className="w-4 h-4 mr-2 inline" /> 
                      {processingId === selectedAlert.sighting.id ? "Processing..." : "Neglect"}
                    </Button>
                    
                    {/* USER TAB: VERIFY BUTTON (Red) */}
                    <Button 
                      variant="secondary" 
                      className={`flex-1 transition-all disabled:cursor-not-allowed disabled:shadow-none disabled:!border-transparent ${
                        isDark 
                          ? "enabled:bg-red-500/10 enabled:text-red-400 enabled:hover:bg-red-500/20 disabled:!bg-white/5 disabled:!text-white/30" 
                          : "enabled:bg-red-50 enabled:text-red-600 enabled:hover:bg-red-100 disabled:!bg-gray-100 disabled:!text-gray-400"
                      }`}
                      onClick={() => verifySighting(selectedAlert.sighting.id)}
                      disabled={processingId === selectedAlert.sighting.id || selectedAlert.status === "neglected" || selectedAlert.status === "verified"}
                    >
                      <Check className="w-4 h-4 mr-2 inline" /> 
                      {processingId === selectedAlert.sighting.id ? "Processing..." : "Verify"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}