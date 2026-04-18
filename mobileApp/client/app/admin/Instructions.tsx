import { View, Text, ScrollView } from "react-native";

export default function Overview() {
  return (
    <ScrollView className="flex-1 bg-[#FFF8E7]">

      {/* Header Title */}
      <View className="px-5 pt-16 pb-6">
        <Text className="text-3xl font-bold text-black">
          Instructions
        </Text>

        <Text className="text-gray-500 mt-1">
          Admin Dashboard
        </Text>
      </View>

      {/* Content Card */}
      <View className="px-5">

        <View className="bg-white p-5 rounded-xl shadow">
          <Text className="text-lg font-bold mb-2">
            Welcome 👋
          </Text>

          <Text className="text-gray-600">
            This is your admin geofencing page. From here you can manage alerts,
            monitor drones, view maps, and control the system.
          </Text>
        </View>

      </View>

    </ScrollView>
  );
}