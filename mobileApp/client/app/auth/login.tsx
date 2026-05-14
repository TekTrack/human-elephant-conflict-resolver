import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "@/config/app";
import ForgotPasswordScreen from "./forgot-password";


export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
        return;
      }

      await AsyncStorage.setItem("authToken", data.token);
      await AsyncStorage.setItem("email", data.data.email);

      router.replace("/admin/home");
    } catch (error) {
      Alert.alert("Error", "Cannot connect to server");
      console.log(error);
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

          {/* LOGO + APP NAME */}
          <View className="flex-row items-center">
            <View className="w-9 h-9 rounded-full bg-[#012d1d] items-center justify-center mr-2">
              <Ionicons name="leaf" size={18} color="#fff" />
            </View>

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
        <View className="items-center mt-8">
          <View className="w-24 h-24 rounded-full bg-[#1b4332] items-center justify-center shadow-lg">
            <Ionicons name="leaf" size={40} color="#fff" />
          </View>
        </View>

        {/* TITLE */}
        <View className="px-6 mt-8">
          <Text className="text-3xl font-bold text-[#012d1d]">
            Login
          </Text>
          <Text className="text-gray-500 mt-1">
            please provide details below to login
          </Text>
        </View>

        {/* FORM */}
        <View className="px-6 mt-6 space-y-4">

          {/* EMAIL */}
          <View>
            <Text className="text-sm text-gray-500 mb-1">Email</Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl bg-gray-100 px-3 h-14">
              <Ionicons name="mail-outline" size={20} color="#666" />
              <TextInput
                placeholder="protector@jumbowatch.org"
                className="flex-1 ml-3 text-base"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>
          </View>

          {/* PASSWORD */}
          <View>
            <Text className="text-sm text-gray-500 mb-1">Password</Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl bg-gray-100 px-3 h-14">
              <Ionicons name="lock-closed-outline" size={20} color="#666" />
              <TextInput
                placeholder="••••••••"
                secureTextEntry={secureText}
                className="flex-1 ml-3 text-base"
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                <Ionicons
                  name={secureText ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* OPTIONS */}
          <View className="flex-row justify-between items-center mt-2">
            <TouchableOpacity className="flex-row items-center">
              <View className="w-5 h-5 border border-gray-400 rounded mr-2" />
              <Text className="text-sm">Remember Me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("./forgot-password")}>
              <Text className="text-sm text-[#795950]">
                Forget your password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* LOGIN BUTTON */}
          <TouchableOpacity
            onPress={login}
            disabled={loading}
            className="bg-[#012d1d] h-14 rounded-xl items-center justify-center mt-4"
          >
            <Text className="text-white text-lg font-semibold">
              {loading ? "Logging in..." : "Log In"}
            </Text>
          </TouchableOpacity>

          {/* DIVIDER */}
          <View className="flex-row items-center my-5">
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="mx-3 text-gray-400 text-xs uppercase">or</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>

          {/* GOOGLE BUTTON */}
          <TouchableOpacity className="flex-row items-center justify-center border border-gray-300 rounded-xl h-14 bg-white">
            <Text className="text-blue-500 text-xl font-bold mr-2">G</Text>
            <Text className="text-base">Continue with Google</Text>
          </TouchableOpacity>
        </View>

        {/* IMAGE SECTION */}
        {/* <View className="mt-10 px-6">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1564769625905-50e93615e769",
            }}
            className="w-full h-48 rounded-2xl"
          />
          <Text className="text-xs text-white absolute bottom-4 left-8 right-8">
            "Protecting the giants of our earth through community vigilance."
          </Text>
        </View> */}

        {/* FOOTER */}
        <View className="items-center mt-8">
          <TouchableOpacity onPress={() => router.push("/auth/register")}>
            <Text className="text-gray-600">
              Don’t have an account?
              <Text className="text-[#012d1d] font-bold"> Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}