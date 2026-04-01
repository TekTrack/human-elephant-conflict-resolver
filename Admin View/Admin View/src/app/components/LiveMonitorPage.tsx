import { useTheme } from "../context/ThemeContext";
import { Video, Activity, Eye, Radio } from "lucide-react";

export function LiveMonitorPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cameras = [
    { id: 1, name: "Main Entrance", status: "active", viewers: 12, location: "Building A" },
    { id: 2, name: "Parking Lot", status: "active", viewers: 8, location: "Building B" },
    { id: 3, name: "Reception Area", status: "active", viewers: 15, location: "Building A" },
    { id: 4, name: "Server Room", status: "maintenance", viewers: 0, location: "Building C" },
    { id: 5, name: "Conference Room", status: "active", viewers: 5, location: "Building A" },
    { id: 6, name: "Emergency Exit", status: "active", viewers: 3, location: "Building B" },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Live Monitor</h1>
          <p className={`text-sm mt-1 ${isDark ? "text-[rgba(255,255,255,0.4)]" : "text-gray-500"}`}>
            Real-time surveillance camera feeds
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/20">
            <Radio className="w-4 h-4 text-green-500 animate-pulse" />
            <span className="text-sm text-green-500 font-medium">Live</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl ${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-100"}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Video className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className={`text-sm ${isDark ? "text-[rgba(255,255,255,0.6)]" : "text-gray-600"}`}>Total Cameras</p>
              <p className="text-xl font-semibold">24</p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl ${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-100"}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className={`text-sm ${isDark ? "text-[rgba(255,255,255,0.6)]" : "text-gray-600"}`}>Active</p>
              <p className="text-xl font-semibold">22</p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl ${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-100"}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100">
              <Video className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className={`text-sm ${isDark ? "text-[rgba(255,255,255,0.6)]" : "text-gray-600"}`}>Maintenance</p>
              <p className="text-xl font-semibold">2</p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl ${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-100"}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className={`text-sm ${isDark ? "text-[rgba(255,255,255,0.6)]" : "text-gray-600"}`}>Total Viewers</p>
              <p className="text-xl font-semibold">43</p>
            </div>
          </div>
        </div>
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {cameras.map((camera) => (
          <div
            key={camera.id}
            className={`rounded-xl overflow-hidden border ${
              isDark
                ? "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)]"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Video Feed Placeholder */}
            <div className={`aspect-video ${isDark ? "bg-[#1a1a1a]" : "bg-gray-900"} relative`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="w-12 h-12 text-gray-600" />
              </div>
              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                {camera.status === "active" ? (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-500/90 backdrop-blur">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-xs text-white font-medium">LIVE</span>
                  </div>
                ) : (
                  <div className="px-2 py-1 rounded-md bg-yellow-500/90 backdrop-blur">
                    <span className="text-xs text-white font-medium">MAINTENANCE</span>
                  </div>
                )}
              </div>
              {/* Viewer Count */}
              <div className="absolute top-3 right-3">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/50 backdrop-blur">
                  <Eye className="w-3 h-3 text-white" />
                  <span className="text-xs text-white font-medium">{camera.viewers}</span>
                </div>
              </div>
            </div>

            {/* Camera Info */}
            <div className="p-4">
              <h3 className="font-semibold mb-1">{camera.name}</h3>
              <p className={`text-sm ${isDark ? "text-[rgba(255,255,255,0.4)]" : "text-gray-500"}`}>
                📍 {camera.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
