import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import API_BASE_URL from "@/config/app";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MyProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [adminID, setAdminID] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userCategory, setUserCategory] = useState("");
  const [password, setPassword] = useState("");

  const loadProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");

    if (!token) {
      console.log("No token found");
      return;
    }

    const res = await axios.get(
      `${API_BASE_URL}/api/user/getuser`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("USER RESPONSE:", res.data);

    const user = res.data.data;

    if (!user) {
      console.log("User not found in response");
      return;
    }

    setName(user.name || "");
    setEmail(user.email || "");
    setPhoneNumber(user.phoneNumber || "");
    setAdminID(user.adminID || "");
    setUserCategory(user.userCategory || "");

  } catch (error) {
    console.log("FETCH ERROR:", error.response?.data || error.message);
  }
};

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUpdate = async () => {
    const token = await AsyncStorage.getItem("authToken");

    try {
      await axios.post(
        `${API_BASE_URL}/api/user/updateuser`,
        {
          name,
          email,
          adminID,
          phoneNumber,
          userCategory,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <ScrollView className="px-4">

        {/* PROFILE HEADER */}
        <View className="items-center py-8">
          <View className="w-28 h-28 rounded-full bg-green-900 items-center justify-center shadow-lg mb-4">
            <Ionicons name="person" size={50} color="white" />
          </View>

          <Text className="text-2xl font-bold text-neutral-900">
            {name || "Your Name"}
          </Text>
          <Text className="text-gray-500 text-sm mt-1">
            Manage your account details
          </Text>
        </View>

        {/* FORM */}
        <View className="bg-white p-5 rounded-2xl border border-gray-200">

          {/* NAME */}
          <View className="mb-4">
            <Text className="text-xs text-gray-500 mb-1">Full Name</Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-3">
              <Ionicons name="person-outline" size={18} color="gray" />
              <TextInput
                value={name}
                onChangeText={setName}
                className="flex-1 py-3 ml-2 text-black"
              />
            </View>
          </View>

          {/* EMAIL */}
          <View className="mb-4">
            <Text className="text-xs text-gray-500 mb-1">Email</Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-3">
              <Ionicons name="mail-outline" size={18} color="gray" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                className="flex-1 py-3 ml-2 text-black"
              />
            </View>
          </View>

          {/* ADMIN ID */}
          <View className="mb-4">
            <Text className="text-xs text-gray-500 mb-1">Admin ID</Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-3">
              <Ionicons name="card-outline" size={18} color="gray" />
              <TextInput
                value={adminID}
                onChangeText={setAdminID}
                className="flex-1 py-3 ml-2 text-black"
              />
            </View>
          </View>

          {/* PHONE */}
          <View className="mb-4">
            <Text className="text-xs text-gray-500 mb-1">Phone Number</Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-3">
              <Ionicons name="call-outline" size={18} color="gray" />
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                className="flex-1 py-3 ml-2 text-black"
              />
            </View>
          </View>

          {/* CATEGORY */}
          <View className="mb-4">
            <Text className="text-xs text-gray-500 mb-1">User Category</Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-3">
              <Ionicons name="layers-outline" size={18} color="gray" />
              <TextInput
                value={userCategory}
                onChangeText={setUserCategory}
                className="flex-1 py-3 ml-2 text-black"
              />
            </View>
          </View>

          {/* PASSWORD */}
          <View className="mb-4">
            <Text className="text-xs text-gray-500 mb-1">New Password</Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-3">
              <Ionicons name="lock-closed-outline" size={18} color="gray" />
              <TextInput
                placeholder="Leave blank to keep current"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                className="flex-1 py-3 ml-2 text-black"
              />
            </View>
          </View>

          {/* BUTTON */}
          <TouchableOpacity
            onPress={handleUpdate}
            className="bg-green-900 py-4 rounded-xl mt-3"
          >
            <Text className="text-white text-center font-bold">
              Update Profile
            </Text>
          </TouchableOpacity>

          <Text className="text-center text-xs text-gray-400 mt-3">
            Last updated recently
          </Text>
        </View>

        {/* EXTRA ACTIONS */}
        <View className="flex-row gap-4 mt-6 mb-10">

          <View className="flex-1 bg-gray-100 p-4 rounded-xl flex-row items-center gap-2">
            <Ionicons name="notifications-outline" size={20} color="#065f46" />
            <Text className="text-sm">Alerts</Text>
          </View>

          <View className="flex-1 bg-gray-100 p-4 rounded-xl flex-row items-center gap-2">
            <Ionicons name="shield-outline" size={20} color="#065f46" />
            <Text className="text-sm">Privacy</Text>
          </View>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}