import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";

export default function Overview() {
  return (
    <ScrollView className="flex-1 bg-[#FFF8E7]">

      <View className="px-6 pt-16 pb-6 bg-[#FFF8E7]">

  {/* Top Row */}
  <View className="flex-row items-center justify-between">

    {/* App Identity */}
    <View>
      <Text className="text-2xl font-extrabold text-black tracking-wide">
        Jumbo Watch
      </Text>

      <View className="flex-row items-center mt-1">
        <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
        <Text className="text-gray-600 text-sm">
          System Active
        </Text>
      </View>
    </View>

    {/* Icon Badge */}
    <View className="w-11 h-11 rounded-full bg-black/10 items-center justify-center">
      <Text className="text-lg">🐘</Text>
    </View>

  </View>

  {/* Subtitle Card Style */}
  <View className="mt-5 bg-white/60 p-3 rounded-xl">
    <Text className="text-gray-700 text-sm font-medium">
      Real-time elephant monitoring & safety intelligence
    </Text>
  </View>

</View>

      {/* HERO IMAGE */}
      <View className="px-6 mb-6">
        <View className="rounded-2xl overflow-hidden h-48">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46"
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      </View>

      {/* LARGE NAV CARDS */}

      {/* Sightings */}
      <View className="px-6 mb-5">
        <TouchableOpacity
          onPress={() => router.push("/admin/sighting-alerts")}
          className="rounded-2xl overflow-hidden"
        >
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429"
            }}
            className="w-full h-40"
          />
          <View className="absolute bottom-0 bg-black/50 w-full p-4">
            <Text className="text-white text-xl font-bold">
              Sightings
            </Text>
            <Text className="text-gray-200 text-sm">
              View latest elephant alerts
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View className="px-6 mb-5">
        <TouchableOpacity
          onPress={() => router.push("/admin/geofencing")}
          className="rounded-2xl overflow-hidden"
        >
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1526779259212-939e64788e3c"
            }}
            className="w-full h-40"
          />
          <View className="absolute bottom-0 bg-black/50 w-full p-4">
            <Text className="text-white text-xl font-bold">
              Map
            </Text>
            <Text className="text-gray-200 text-sm">
              View safe zones & tracking
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Upload */}
      <View className="px-6 mb-5">
        <TouchableOpacity
          onPress={() => router.push("/admin/upload-image")}
          className="rounded-2xl overflow-hidden"
        >
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1520975922284-9c9a7b8e0a45"
            }}
            className="w-full h-40"
          />
          <View className="absolute bottom-0 bg-black/50 w-full p-4">
            <Text className="text-white text-xl font-bold">
              Report
            </Text>
            <Text className="text-gray-200 text-sm">
              Upload sighting images
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Profile */}
      <View className="px-6 mb-10">
        <TouchableOpacity
          onPress={() => router.push("/admin/my-profile")}
          className="rounded-2xl overflow-hidden"
        >
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
            }}
            className="w-full h-40"
          />
          <View className="absolute bottom-0 bg-black/50 w-full p-4">
            <Text className="text-white text-xl font-bold">
              My Profile
            </Text>
            <Text className="text-gray-200 text-sm">
              Manage your account
            </Text>
          </View>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}