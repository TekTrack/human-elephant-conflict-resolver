import { useTheme } from "../context/ThemeContext";
import svgPaths from "../../imports/svg-jvw402qc7a";
import { ChevronDown } from "lucide-react";

export function OverviewPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const stats = [
    {
      label: "Views",
      value: "7,265",
      change: "+11.01%",
      isPositive: true,
      bgColor: isDark ? "#e6f1fd" : "#e6f1fd",
    },
    {
      label: "Visits",
      value: "3,671",
      change: "-0.03%",
      isPositive: false,
      bgColor: isDark ? "#edeefc" : "#edeefc",
    },
    {
      label: "New Users",
      value: "256",
      change: "+15.03%",
      isPositive: true,
      bgColor: isDark ? "#e3f5ff" : "#e3f5ff",
    },
    {
      label: "Active Users",
      value: "2,318",
      change: "+6.08%",
      isPositive: true,
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
                <div className="flex items-center gap-2">
                  <span className="text-xs text-black">{stat.change}</span>
                  <div className="w-4 h-4">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 12.5 8">
                      <path
                        clipRule="evenodd"
                        d={stat.isPositive ? svgPaths.p152e6a00 : svgPaths.p1622b780}
                        fill="black"
                        fillRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
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
          <div className={`p-4 rounded-lg ${
            isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-white"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">User engagement increased</p>
                <p className={`text-sm ${isDark ? "text-[rgba(255,255,255,0.4)]" : "text-gray-500"}`}>
                  Active users up by 15% this week
                </p>
              </div>
              <span className="text-green-500 text-sm font-medium">+15%</span>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${
            isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-white"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New feature launched</p>
                <p className={`text-sm ${isDark ? "text-[rgba(255,255,255,0.4)]" : "text-gray-500"}`}>
                  Dashboard analytics now available
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                isDark ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-700"
              }`}>
                New
              </span>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${
            isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-white"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">System performance optimized</p>
                <p className={`text-sm ${isDark ? "text-[rgba(255,255,255,0.4)]" : "text-gray-500"}`}>
                  Page load time reduced by 25%
                </p>
              </div>
              <span className="text-green-500 text-sm font-medium">+25%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
