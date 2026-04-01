import { useTheme } from "../context/ThemeContext";
import { AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";

export function SightingAlertsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const alerts = [
    {
      id: 1,
      title: "Critical: Unauthorized Access Attempt",
      description: "Multiple failed login attempts detected from IP 192.168.1.100",
      status: "critical",
      time: "2 minutes ago",
      location: "Building A - Floor 3",
    },
    {
      id: 2,
      title: "Warning: Unusual Activity Detected",
      description: "Movement detected in restricted area during off-hours",
      status: "warning",
      time: "15 minutes ago",
      location: "Building B - Parking",
    },
    {
      id: 3,
      title: "Info: New Device Connected",
      description: "Unknown device connected to network",
      status: "info",
      time: "1 hour ago",
      location: "Building C - Lobby",
    },
    {
      id: 4,
      title: "Resolved: Door Left Open",
      description: "Security door at main entrance was secured",
      status: "resolved",
      time: "2 hours ago",
      location: "Building A - Main Entrance",
    },
  ];

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

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Sighting Alerts</h1>
          <p className={`text-sm mt-1 ${isDark ? "text-[rgba(255,255,255,0.4)]" : "text-gray-500"}`}>
            Monitor and manage security alerts in real-time
          </p>
        </div>
        <div className="flex gap-2">
          <button className={`px-4 py-2 rounded-lg text-sm ${
            isDark ? "bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)]" : "bg-gray-200 hover:bg-gray-300"
          }`}>
            Filter
          </button>
          <button className={`px-4 py-2 rounded-lg text-sm ${
            isDark ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
          } text-white`}>
            Mark All Read
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl ${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-100"}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className={`text-sm ${isDark ? "text-[rgba(255,255,255,0.6)]" : "text-gray-600"}`}>Critical</p>
              <p className="text-xl font-semibold">3</p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl ${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-100"}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className={`text-sm ${isDark ? "text-[rgba(255,255,255,0.6)]" : "text-gray-600"}`}>Warning</p>
              <p className="text-xl font-semibold">7</p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl ${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-100"}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className={`text-sm ${isDark ? "text-[rgba(255,255,255,0.6)]" : "text-gray-600"}`}>Info</p>
              <p className="text-xl font-semibold">12</p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl ${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-100"}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className={`text-sm ${isDark ? "text-[rgba(255,255,255,0.6)]" : "text-gray-600"}`}>Resolved</p>
              <p className="text-xl font-semibold">45</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-5 rounded-xl border ${
              isDark
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
    </div>
  );
}
