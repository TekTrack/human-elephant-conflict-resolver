import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import API_BASE_URL from "@/config/app";

export default function ForgotPasswordScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      Alert.alert("Error", "Please enter a valid phone number.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/sms/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.message || "Failed to send OTP.");
        return;
      }

      Alert.alert("Success", "OTP sent successfully. Please check your phone.");

      router.push({
        pathname: "/auth/verify-otp",
        params: { phone: phoneNumber },
      });
    } catch (error) {
      Alert.alert("Error", "Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fcf9f8]">
      <StatusBar barStyle="dark-content" />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

        {/* HEADER */}
        <View className="flex-row justify-between items-center px-4 py-10">

          {/* BACK + APP NAME */}
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-9 h-9 rounded-full bg-[#012d1d] items-center justify-center mr-2"
            >
              <Ionicons name="arrow-back" size={18} color="#fff" />
            </TouchableOpacity>

            <Text className="text-lg font-extrabold text-[#012d1d]">
              Jumbo Watch
            </Text>
          </View>

          {/* LANGUAGE */}
          <TouchableOpacity className="flex-row items-center border border-gray-300 px-3 py-1 rounded-lg">
            <Ionicons name="language" size={16} color="#012d1d" />
            <Text className="ml-1 text-sm font-semibold text-[#012d1d]">
              භාෂාව
            </Text>
            <Ionicons name="chevron-down" size={16} color="#012d1d" />
          </TouchableOpacity>

        </View>

        {/* HERO ICON */}
        <View className="items-center mt-4">
          <View className="w-24 h-24 rounded-full bg-[#1b4332] items-center justify-center shadow-lg">
            <Ionicons name="phone-portrait-outline" size={40} color="#fff" />
          </View>
        </View>

        {/* TITLE */}
        <View className="px-6 mt-8">
          <Text className="text-3xl font-bold text-[#012d1d]">
            OTP Login
          </Text>
          <Text className="text-gray-500 mt-1">
            Enter your phone number to receive a one-time password. (e.g., 07X XXX XXXX)
          </Text>
        </View>

        {/* FORM */}
        <View className="px-6 mt-6 space-y-4">

          {/* PHONE NUMBER */}
          <View>
            <Text className="text-sm text-gray-500 mb-1">Phone Number</Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl bg-gray-100 px-3 h-14">
              <Ionicons name="call-outline" size={20} color="#666" />
              <TextInput
                placeholder="07X XXX XXXX"
                className="flex-1 ml-3 text-base"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
                maxLength={10}
              />
            </View>
          </View>

          {/* SEND OTP BUTTON */}
          <TouchableOpacity
            onPress={sendOTP}
            disabled={loading}
            className="bg-[#012d1d] h-14 rounded-xl items-center justify-center mt-4"
            style={loading ? { opacity: 0.7 } : undefined}
          >
            <Text className="text-white text-lg font-semibold">
              {loading ? "Sending OTP..." : "Get OTP Code"}
            </Text>
          </TouchableOpacity>

        </View>

        {/* FOOTER */}
        <View className="items-center mt-8">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-gray-600">
              Remember your password?
              <Text className="text-[#012d1d] font-bold"> Login</Text>
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}