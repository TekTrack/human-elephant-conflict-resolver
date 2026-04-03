import { useTheme } from "../context/ThemeContext";
import svgPaths from "../../imports/svg-jvw402qc7a";
import { ChevronDown } from "lucide-react";

export function OverviewPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const stats = [
    {
      label: "Active Drones",
      value: "12/16",
      bgColor: isDark ? "#e6f1fd" : "#e6f1fd",
    },
    {
      label: "Total Zones",
      value: "_",
      bgColor: isDark ? "#edeefc" : "#edeefc",
    },
    {
      label: "Users",
      value: "256",
      bgColor: isDark ? "#e3f5ff" : "#e3f5ff",
    },
    {
      label: "Total Sightings",
      value: "2,318",
      bgColor: isDark ? "#e5ecf6" : "#e5ecf6",
    },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Overview</h1>
        <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
          isDark ? "bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)]" : "bg-gray-200 hover:bg-gray-300"
        }`}>
          Today
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-[20px] p-6"
            style={{ backgroundColor: stat.bgColor }}
          >
            <div className="space-y-2">
              <p className="text-sm text-black">{stat.label}</p>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-black">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Content Area */}
      <div className={`rounded-2xl p-8 ${
        isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-100"
      }`}>
        <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
        <div className="space-y-4">

          {/* recent acitvity cards */}


          <div className={`p-4 rounded-lg ${
            isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-white"
          }`}>
            <div className="flex items-center justify-between">
              <div>

              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${
              isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-white"
          }`}>
            <div className="flex items-center justify-between">
              <div>

              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${
              isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-white"
          }`}>
            <div className="flex items-center justify-between">
              <div>

              </div>
            </div>
          </div>



        </div>


      </div>
    </div>
  );
}
