import { Video, Activity, Radio } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";

export function LiveMonitorPage() {
  const Drones = [
      { id: "D1", name: "Drone A ",status : 1, location: "Zone C" , feed : "Admin View/Admin View/src/assets/alert_20260328_065413.jpg" },
      { id: "D2", name: "Drone G ",status : 0, location: "Zone A" },
    // ... other drones
  ];

  return (
      <div className="p-8 space-y-6">
        <PageHeader
            title="Live Monitor"
            description="Real-time surveillance camera feeds"
            actions={
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/20">
                <Radio className="w-4 h-4 text-green-500 animate-pulse" />
                <span className="text-sm text-green-500 font-medium">Live</span>
              </div>
            }
        />

        {/* Stats Summary - Now clean and declarative */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard
              label="Total Drones"
              value="24"
              icon={<Video className="w-5 h-5 text-blue-600" />}
              iconBgClass="bg-blue-100"
          />
          <StatCard
              label="Active"
              value="22"
              icon={<Activity className="w-5 h-5 text-green-600" />}
              iconBgClass="bg-green-100"
          />
          <StatCard
              label="Maintenance"
              value="2"
              icon={<Video className="w-5 h-5 text-yellow-600" />}
              iconBgClass="bg-yellow-100"
          />
        </div>

        {/* Camera Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Drones.map((drone) => (
              <Card key={drone.id} noPadding>
                {/* Video Feed Placeholder */}
                <div className="aspect-video bg-gray-900 dark:bg-[#1a1a1a] relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="w-12 h-12 text-gray-600" />
                  </div>

                  <div className="absolute top-3 left-3">
                    {drone.status === 1 ? (
                        <Badge variant="success">LIVE</Badge>
                    ) : (
                        <Badge variant="warning">MAINTENANCE</Badge>
                    )}
                  </div>

                </div>

                {/* Camera Info */}
                <div className="p-4">
                  <h3 className="font-semibold mb-1  dark:text-white">{drone.name}</h3>
                  <p className="text-sm  dark:text-[rgba(255,255,255,0.4)]">
                    📍 {drone.location}
                  </p>
                </div>
              </Card>
          ))}
        </div>
      </div>
  );
}