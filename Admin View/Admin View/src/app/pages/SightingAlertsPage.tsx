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
  ClockPlus, Drone, DroneIcon, Radio, Plus
} from "lucide-react";
import { useMapTrigger } from "../context/MapTriggerContext.tsx";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Navigate, useNavigate } from "react-router";
import {StatCard} from "../components/StatCard.tsx";
import {PageHeader} from "../components/PageHeader.tsx";
import { useParams } from "react-router";


type FilterValue = "all" | "hour" | "day" | "week";

interface Sighting {
  id: number;
  photoFilename: string;
  verified: boolean;
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

  const { BASE_URL, mapTrigger, setMapTrigger } = useMapTrigger();

  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const navigate = useNavigate();
  const { sightingId } = useParams<{sightingId:string}>();

  const fetchSightings = async (filter: FilterValue) => {
    const token = localStorage.getItem('authToken'); // Grab the saved token
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

  useEffect(()=>{
    const currentSighting= alerts.find(s=>s.id===Number(sightingId));
    setSelectedAlert(currentSighting||null);
  },[sightingId,alerts])

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
      title: `ELEPHANT Sighting!`,
      description: (() => { if (sighting.source === "drone") { return "Critical: Drone No: " + sighting.droneId + " has idenfied an elephant!"; } else { return "Warning: There is a elephant sighting by an app user. Check Details!" } })(),
      status: (() => { if (sighting.source === "drone" || sighting.verified) { return "critical"; } else { return "warning"; } })(),
      location: `Latitude : ${sighting.latitude} , Longitude : ${sighting.longitude} `,
      rawTime: sighting.timestamp,
      sighting: sighting

    }));
    setAlerts(alertSet);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "info":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "resolved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      critical: "bg-red-100 text-red-700",
      warning: "bg-yellow-100 text-yellow-700",
      info: "bg-blue-100 text-blue-700",
      resolved: "bg-green-100 text-green-700",
    };
    return styles[status as keyof typeof styles] || "";
  };

  const getAlertCount = (stausType: string) => {
    return alerts.filter(a => a.status === stausType).length;
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

  return (
    <div className="p-8 space-y-6">

      <PageHeader
          title="User Sighting Alerts"
          description="Elephants sightings captured by users"
      />

      {/* Stats Summary */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <StatCard
            label={"Total User Sightings"}
            value={getAlertCount("critical")}
            icon={<ScanEye/>}
            iconBgClass=" bg-blue-500 text-white "
        >
        </StatCard>

        <StatCard
            label={"Resolved User Sightings"}
            value={getAlertCount("resolved")}
            icon={<CheckLine/>}
            iconBgClass="pr bg-green-500 text-white  "
        >
        </StatCard>

        <StatCard
            label={"Unresolved User Sightings"}
            value={getAlertCount("unresolved")}
            icon={<X/>}
            iconBgClass="pr bg-red-500 text-white  "
        >
        </StatCard>

        <StatCard
            label={"New User Sightings"}
            value={getAlertCount("new")}
            icon={<ClockPlus />}
            iconBgClass="pr bg-orange-500 text-white  "
        >
        </StatCard>






        {/*<div className={`p-4 rounded-xl ${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-100"}`}>*/}
        {/*  <div className="flex items-center gap-3">*/}
        {/*    <div className="p-2 rounded-lg bg-red-100">*/}
        {/*      <XCircle className="w-5 h-5 text-red-600" />*/}
        {/*    </div>*/}
        {/*    <div>*/}
        {/*      <p className={`text-sm ${isDark ? "text-[rgba(255,255,255,0.6)]" : "text-gray-600"}`}>Critical</p>*/}
        {/*      <p className="text-xl font-semibold">{getAlertCount("critical")}</p>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/*<div className={`p-4 rounded-xl ${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-100"}`}>*/}
        {/*  <div className="flex items-center gap-3">*/}
        {/*    <div className="p-2 rounded-lg bg-yellow-100">*/}
        {/*      <AlertTriangle className="w-5 h-5 text-yellow-600" />*/}
        {/*    </div>*/}
        {/*    <div>*/}
        {/*      <p className={`text-sm ${isDark ? "text-[rgba(255,255,255,0.6)]" : "text-gray-600"}`}>Warning</p>*/}
        {/*      <p className="text-xl font-semibold">{getAlertCount("warning")}</p>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/*<div className={`p-4 rounded-xl ${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-100"}`}>*/}
        {/*  <div className="flex items-center gap-3">*/}
        {/*    <div className="p-2 rounded-lg bg-blue-100">*/}
        {/*      <Clock className="w-5 h-5 text-blue-600" />*/}
        {/*    </div>*/}
        {/*    <div>*/}
        {/*      <p className={`text-sm ${isDark ? "text-[rgba(255,255,255,0.6)]" : "text-gray-600"}`}>Info</p>*/}
        {/*      <p className="text-xl font-semibold">{getAlertCount("info")}</p>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/*<div className={`p-4 rounded-xl ${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-100"}`}>*/}
        {/*  <div className="flex items-center gap-3">*/}
        {/*    <div className="p-2 rounded-lg bg-green-100">*/}
        {/*      <CheckCircle className="w-5 h-5 text-green-600" />*/}
        {/*    </div>*/}
        {/*    <div>*/}
        {/*      <p className={`text-sm ${isDark ? "text-[rgba(255,255,255,0.6)]" : "text-gray-600"}`}>Resolved</p>*/}
        {/*      <p className="text-xl font-semibold">{getAlertCount("resolved")}</p>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts
          .sort((a, b) => new Date(b.rawTime).getTime() - new Date(a.rawTime).getTime())
          .map((alert) => (
            <div
              key={alert.id}
              onClick={() => setSelectedAlert(alert)}
              className={`p-5 rounded-xl border ${isDark
                ? "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)]"
                : "bg-white border-gray-200 hover:bg-gray-50"
                } transition-colors cursor-pointer`}
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
          ))}
      </div>

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
                        onClick={() => alert("Navigate to Geofencing Map page")}
                        className={`p-1.5 rounded-lg transition-colors border ${isDark ? "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300" : "bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-600 hover:text-blue-700"}`}
                        title="View on Map"
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
                          onClick={() =>navigate(`/live-monitor/${selectedAlert.sighting.droneId}`)}
                          className={`p-1.5 rounded-lg transition-colors border ${isDark ? "bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400 hover:text-red-300" : "bg-red-50 border-red-200 hover:bg-red-100 text-red-600 hover:text-red-700"}`}
                          title="View Live Feed"
                        >
                          <Video className="w-4 h-4" />
                        </button>
                      )
                    }
                  />
                  <InfoItem label="Verified" value={selectedAlert.sighting.verified ? "Yes" : "Pending or No"} isDark={isDark} />
                </div>
              </div>

              <div className={`w-full rounded-xl flex items-center justify-center overflow-hidden min-h-[300px] border ${isDark ? "bg-black/20 border-white/5" : "bg-gray-50 border-gray-200"}`}>
                {/* Image Placeholder pending API */}
                <img
                  src={`${BASE_URL}/sightings/images/${selectedAlert.sighting.photoFilename}`}
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
                  <X className="w-4 h-4 mr-2" /> Close
                </Button>

                {selectedAlert.sighting.source === "drone" ? (
                  <Button variant="primary" className="flex-1 shadow-lg shadow-blue-500/20" onClick={() => navigate(`/live-monitor/${selectedAlert.sighting.droneId}`)}>
                    <Video className="w-4 h-4 mr-2 inline" /> View Drone
                  </Button>
                ) : (
                  <Button variant="primary" className="flex-1 shadow-lg shadow-blue-500/20" onClick={() => alert("Verification API logic here to verify sighting ID: " + selectedAlert.sighting.id)}>
                    <Check className="w-4 h-4 mr-2 inline" /> Verify Sighting
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
      <PageHeader
          title="Drone Sighting Alerts"
          description="Real-time Drone Sightings"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
            label={"Total Drone Sightings"}
            value={getAlertCount("Drones")}
            icon={<Drone />}
            iconBgClass="pr bg-yellow-500 text-white  "
        >
        </StatCard>
        <StatCard
            label={"Checked Drone Sightings"}
            value={getAlertCount("checked-drones")}
            icon={<CheckLine />}
            iconBgClass="pr bg-green-500 text-white  "
        >
        </StatCard>
        <StatCard
            label={"New Drone Sightings"}
            value={getAlertCount("unchecked-drones")}
            icon={<ClockPlus/>}
            iconBgClass="pr bg-orange-500 text-white  "
        >
        </StatCard>

      </div>




    </div>


  );
}
