import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";

export default function Home() {
  return (
    <ScrollView className="flex-1 bg-[#FFF8E7]">

      {/* Header */}
      <View className="px-5 pt-16 pb-6">
        <Text className="text-3xl font-bold">
          Home Page for User 👋
        </Text>

        <Text className="text-gray-500 mt-1">
          Welcome back, user
        </Text>
      </View>

      {/* Quick Info Card */}
      <View className="px-5">
        <View className="bg-white p-5 rounded-xl shadow mb-5">
          <Text className="text-lg font-bold mb-2">
            🌿 Safety Status
          </Text>
          <Text className="text-gray-600">
            All systems are normal. No alerts detected in your area.
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View className="px-5 space-y-4">

        {/* View Alerts */}
        <TouchableOpacity
          onPress={() => router.push("/")}
          className="bg-white p-4 rounded-xl shadow"
        >
          <Text className="text-lg font-bold mb-1">
            🐘 View Alerts
          </Text>
          <Text className="text-gray-600">
            Check nearby elephant sightings
          </Text>
        </TouchableOpacity>

        {/* Map */}
        <TouchableOpacity
          onPress={() => router.push("/")}
          className="bg-white p-4 rounded-xl shadow"
        >
          <Text className="text-lg font-bold mb-1">
            🗺 View Map
          </Text>
          <Text className="text-gray-600">
            See monitored areas near you
          </Text>
        </TouchableOpacity>

        {/* Geofencing Info */}
        <TouchableOpacity
          onPress={() => router.push("/")}
          className="bg-white p-4 rounded-xl shadow"
        >
          <Text className="text-lg font-bold mb-1">
            📍 Safety Zones
          </Text>
          <Text className="text-gray-600">
            View restricted and safe zones
          </Text>
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
          onPress={() => router.push("/")}
          className="bg-white p-4 rounded-xl shadow mb-10"
        >
          <Text className="text-lg font-bold mb-1">
            👤 Profile
          </Text>
          <Text className="text-gray-600">
            Manage your account
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}