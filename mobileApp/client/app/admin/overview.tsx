import { View, Text, ScrollView } from "react-native";

export default function OverviewScreen() {
  const stats = [
    { label: "Active Drones", value: "12/16", color: "bg-blue-100" },
    { label: "Total Zones", value: "-", color: "bg-purple-100" },
    { label: "Users", value: "256", color: "bg-sky-100" },
    { label: "Total Sightings", value: "2,318", color: "bg-slate-100" },
  ];

  const activity = [
    "Drone A is now active",
    "New sighting detected",
    "Zone updated successfully",
  ];

  return (
    <ScrollView className="flex-1 bg-[#FFF8E7] px-5 pt-6">

      {/* Header */}
      <Text className="text-3xl font-bold mb-6">Overview</Text>

      {/* Stats */}
      <View className="flex-row flex-wrap justify-between">
        {stats.map((item, index) => (
          <View
            key={index}
            className={`w-[48%] p-4 rounded-xl mb-4 ${item.color}`}
          >
            <Text className="text-gray-600 text-sm">{item.label}</Text>
            <Text className="text-xl font-bold mt-2">{item.value}</Text>
          </View>
        ))}
      </View>

      {/* Recent Activity */}
      <View className="bg-white p-4 rounded-xl mt-4">
        <Text className="text-lg font-bold mb-3">Recent Activity</Text>

        {activity.map((item, index) => (
          <View
            key={index}
            className="py-3 border-b border-gray-200 last:border-0"
          >
            <Text className="text-gray-700">{item}</Text>
          </View>
        ))}
      </View>

    </ScrollView>
  );
}