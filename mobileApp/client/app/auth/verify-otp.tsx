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
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "@/config/app";

export default function VerifyOTPScreen() {
  const { phone } = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingOTP, setLoadingOTP] = useState(false);

  const verifyOTP = async () => {
    if (otp.length < 4) {
      Alert.alert("Error", "Please enter a valid OTP code.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/sms/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.message || "Input OTP is incorrect.");
        return;
      }

      console.log("OTP verification successful:", data);
      await AsyncStorage.setItem("authToken", data.token);
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", "Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async () => {
    try {
      setLoadingOTP(true);
      const res = await fetch(`${API_BASE_URL}/api/sms/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.message || "Failed to send OTP.");
        return;
      }

      Alert.alert("Success", "OTP sent successfully. Please check your phone.");
    } catch (error) {
      Alert.alert("Error", "Cannot connect to server.");
    } finally {
      setLoadingOTP(false);
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
            <Ionicons name="shield-checkmark-outline" size={40} color="#fff" />
          </View>
        </View>

        {/* TITLE */}
        <View className="px-6 mt-8">
          <Text className="text-3xl font-bold text-[#012d1d]">
            Verification
          </Text>
          <Text className="text-gray-500 mt-1">
            Enter the OTP code sent to{" "}
            <Text className="font-semibold text-[#012d1d]">{phone}</Text>.
          </Text>
        </View>

        {/* FORM */}
        <View className="px-6 mt-6 space-y-4">

          {/* OTP INPUT */}
          <View>
            <Text className="text-sm text-gray-500 mb-1">OTP Code</Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl bg-gray-100 px-3 h-14">
              <Ionicons name="key-outline" size={20} color="#666" />
              <TextInput
                placeholder="Enter OTP code"
                className="flex-1 ml-3 text-base tracking-widest font-bold"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                placeholderTextColor="#999"
                maxLength={6}
                textAlign="center"
              />
            </View>
          </View>

          {/* VERIFY BUTTON */}
          <TouchableOpacity
            onPress={verifyOTP}
            disabled={loading}
            className="bg-[#012d1d] h-14 rounded-xl items-center justify-center mt-4"
            style={loading ? { opacity: 0.7 } : undefined}
          >
            <Text className="text-white text-lg font-semibold">
              {loading ? "Verifying..." : "Verify & Login"}
            </Text>
          </TouchableOpacity>

        </View>

        {/* RESEND */}
        <View className="flex-row items-center justify-center mt-8">
          <Text className="text-gray-500 text-sm">
            Didn't receive the code?{" "}
          </Text>
          <TouchableOpacity onPress={sendOTP} disabled={loadingOTP}>
            <Text className="text-[#795950] font-bold text-sm">
              {loadingOTP ? "Sending..." : "Resend Code"}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}