import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import { router } from "expo-router"; // Uncomment if using Expo Router

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#FFF7E8]">
      <StatusBar barStyle="dark-content" />

      {/* HEADER - LANGUAGE SELECTOR */}
      <View className="flex-row justify-end px-6 pt-6">
        <TouchableOpacity className="flex-row items-center">
          <Text className="mr-1 text-base font-bold text-black">භාෂාව</Text>
          <Ionicons name="chevron-down" size={16} color="black" />
        </TouchableOpacity>
      </View>

      {/* ILLUSTRATION SECTION */}
      <View className="flex-1 justify-center items-center mt-4 px-4">
        {/* Replace the URI with your actual local image require('./assets/illustration.png') */}
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1564769625905-50e93615e769", // Placeholder for your shield graphic
          }}
          className="w-full h-64 rounded-2xl"
          resizeMode="contain"
        />

        {/* PAGINATION DOTS */}
        <View className="flex-row justify-center items-center mt-8 space-x-2">
          <View className="h-1.5 w-8 bg-[#F59E0B] rounded-full" />
          <View className="h-1.5 w-4 bg-gray-300 rounded-full" />
        </View>
      </View>

      {/* TEXT SECTION */}
      <View className="px-6 mt-6">
        <Text className="text-4xl font-black text-center text-black tracking-tight">
          Stay One Step Ahead
        </Text>
        <Text className="text-base text-center text-gray-800 mt-4 leading-relaxed font-medium px-2">
          Monitor wildlife movements nearby and notify your community to prevent
          surprise encounters.
        </Text>
      </View>

      {/* BUTTONS SECTION */}
      <View className="px-6 pb-12 mt-10 space-y-4">

        {/* LOG IN BUTTON */}
        <TouchableOpacity
          // onPress={() => router.push("/auth/login")}
          className="bg-[#F59E0B] border border-black rounded-2xl py-4 items-center flex-row justify-center"
        >
          <Text className="text-black text-lg font-bold">Log In</Text>
        </TouchableOpacity>

        {/* SIGN IN / SIGN UP BUTTON */}
        <TouchableOpacity
          // onPress={() => router.push("/auth/register")}
          className="bg-[#FDE9D4] border border-black rounded-2xl py-4 items-center flex-row justify-center"
        >
          {/* Note: The image says "Sign In", but "Sign Up" usually pairs with "Log In" */}
          <Text className="text-black text-lg font-bold">Sign In</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}