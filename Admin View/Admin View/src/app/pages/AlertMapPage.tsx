import { useTheme } from '../context/ThemeContext.tsx';
import { MapPin, AlertCircle, CheckCircle } from "lucide-react";

export function AlertMapPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const mapAlerts = [
    { id: 1, location: "Building A - Floor 3", type: "critical", lat: 40.7128, lng: -74.0060 },
    { id: 2, location: "Building B - Parking", type: "warning", lat: 40.7138, lng: -74.0070 },
    { id: 3, location: "Building C - Lobby", type: "info", lat: 40.7118, lng: -74.0050 },
    { id: 4, location: "Building A - Main Entrance", type: "resolved", lat: 40.7148, lng: -74.0080 },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Alert Map</h1>
          <p className={`text-sm mt-1 ${isDark ? "text-[rgba(255,255,255,0.4)]" : "text-gray-500"}`}>
            Geographic visualization of security alerts
          </p>
        </div>
        <div className="flex gap-2">
          <button className={`px-4 py-2 rounded-lg text-sm ${
            isDark ? "bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)]" : "bg-gray-200 hover:bg-gray-300"
          }`}>
            Refresh
          </button>
          <button className={`px-4 py-2 rounded-lg text-sm ${
            isDark ? "bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)]" : "bg-gray-200 hover:bg-gray-300"
          }`}>
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="xl:col-span-2">
          <div className={`rounded-xl overflow-hidden border h-[600px] ${
            isDark
              ? "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)]"
              : "bg-white border-gray-200"
          }`}>
            {/* Map Placeholder */}
            <div className={`w-full h-full ${isDark ? "bg-[#1a1a1a]" : "bg-gray-100"} relative`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-gray-600" : "text-gray-400"}`} />
                  <p className={isDark ? "text-[rgba(255,255,255,0.4)]" : "text-gray-500"}>
                    Interactive Map View
                  </p>
                  <p className={`text-sm mt-2 ${isDark ? "text-[rgba(255,255,255,0.3)]" : "text-gray-400"}`}>
                    Alert locations would be displayed here
                  </p>
                </div>
              </div>

              {/* Sample Alert Markers */}
              <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute top-0 left-0 w-8 h-8 rounded-full bg-red-500 animate-ping opacity-75" />
                </div>
              </div>

              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alert List Sidebar */}
        <div className="space-y-4">
          <div className={`p-4 rounded-xl ${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-100"}`}>
            <h3 className="font-semibold mb-3">Active Alerts</h3>
            <div className="space-y-3">
              {mapAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    isDark
                      ? "bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)]"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-full ${
                      alert.type === "critical" ? "bg-red-100" :
                      alert.type === "warning" ? "bg-yellow-100" :
                      alert.type === "info" ? "bg-blue-100" :
                      "bg-green-100"
                    }`}>
                      <MapPin className={`w-4 h-4 ${
                        alert.type === "critical" ? "text-red-600" :
                        alert.type === "warning" ? "text-yellow-600" :
                        alert.type === "info" ? "text-blue-600" :
                        "text-green-600"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{alert.location}</p>
                      <p className={`text-xs mt-1 ${isDark ? "text-[rgba(255,255,255,0.4)]" : "text-gray-500"}`}>
                        {alert.lat.toFixed(4)}, {alert.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className={`p-4 rounded-xl ${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-100"}`}>
            <h3 className="font-semibold mb-3">Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm">Critical Alert</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm">Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm">Information</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm">Resolved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
