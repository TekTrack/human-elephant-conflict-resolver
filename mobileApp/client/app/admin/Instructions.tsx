import { View, Text, ScrollView, Image } from "react-native";

export default function Instructions() {
  return (
    <ScrollView className="flex-1 bg-[#FFF8E7]">

      {/* HEADER */}
      <View className="px-6 pt-16 pb-6">
        <Text className="text-3xl font-extrabold text-black">
          Jumbo Watch Guide 📖
        </Text>
        <Text className="text-gray-600 mt-1">
          Learn how to use the system effectively
        </Text>
      </View>

      {/* HERO IMAGE */}
      <View className="px-6 mb-6">
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1601758123927-196e1d1a6c1f"
          }}
          className="w-full h-44 rounded-2xl"
          resizeMode="cover"
        />
      </View>

      {/* SECTION 1 */}
      <View className="px-6 mb-5">
        <View className="bg-white rounded-2xl overflow-hidden shadow">

          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
            }}
            className="w-full h-40"
          />

          <View className="p-4">
            <Text className="text-lg font-bold text-black">
              1. View Elephant Alerts
            </Text>
            <Text className="text-gray-600 mt-1">
              Check real-time sightings reported by users and monitoring systems.
            </Text>
          </View>

        </View>
      </View>

      {/* SECTION 2 */}
      <View className="px-6 mb-5">
        <View className="bg-white rounded-2xl overflow-hidden shadow">

          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1"
            }}
            className="w-full h-40"
          />

          <View className="p-4">
            <Text className="text-lg font-bold text-black">
              2. Use Live Map Tracking
            </Text>
            <Text className="text-gray-600 mt-1">
              Monitor safe zones and elephant movement areas in real-time.
            </Text>
          </View>

        </View>
      </View>

      {/* SECTION 3 */}
      <View className="px-6 mb-5">
        <View className="bg-white rounded-2xl overflow-hidden shadow">

          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1581090700227-4c4c3f4d6f7c"
            }}
            className="w-full h-40"
          />

          <View className="p-4">
            <Text className="text-lg font-bold text-black">
              3. Report Sightings
            </Text>
            <Text className="text-gray-600 mt-1">
              Capture and upload elephant sightings with location data instantly.
            </Text>
          </View>

        </View>
      </View>

      {/* SECTION 4 */}
      <View className="px-6 mb-10">
        <View className="bg-white rounded-2xl overflow-hidden shadow">

          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1520975922284-9c9a7b8e0a45"
            }}
            className="w-full h-40"
          />

          <View className="p-4">
            <Text className="text-lg font-bold text-black">
              4. Manage Your Profile
            </Text>
            <Text className="text-gray-600 mt-1">
              Update your details and keep your account secure anytime.
            </Text>
          </View>

        </View>
      </View>

    </ScrollView>
  );
}