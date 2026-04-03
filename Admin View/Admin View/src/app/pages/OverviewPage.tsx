import { useTheme } from "../context/ThemeContext.tsx";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { Button } from "../components/Button";
import { ChevronDown } from "lucide-react";
import {Card } from "../components/Card";

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
        <PageHeader
            title="Overview"
            actions={
              <Button variant="secondary">
                Today <ChevronDown className="w-4 h-4" />
              </Button>
            }
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
              <StatCard
                  key={index}
                  label={stat.label}
                  value={stat.value}
                  customBgColor={stat.bgColor}
              />
          ))}
        </div>

        {/* Additional Content Area */}
        <Card className="p-8" noPadding>
          <h2 className="text-xl font-semibold mb-6 ">
            Recent Activity
          </h2>

          <div className="space-y-4">
            {/* Recent activity cards - Now using our reusable Card component! */}
            {[1, 2, 3].map((item) => (
                <Card key={item} className="min-h-[60px] flex items-center justify-between">
                  {/* Activity content will go here */}
                  <div className="text-sm">
                    Placeholder for activity item {item}
                  </div>
                </Card>
            ))}
          </div>
        </Card>
      </div>
  );
}