import React, { useState } from "react";
import { View, Text, Image, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "@/config/app";
import { Ionicons } from "@expo/vector-icons";

export default function UserReportPage() {
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 📷 Camera
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  // 📍 Location
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission denied", "Location permission required");
      return null;
    }

    let location = await Location.getCurrentPositionAsync({});
    return location.coords;
  };

  // ⬆ Upload
  const uploadReport = async () => {
    if (!image) {
      Alert.alert("Error", "Please take a photo first");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("authToken");

      const coords = await getLocation();
      if (!coords) return;

      const formData = new FormData();

      formData.append("count", "1");
      formData.append("time", new Date().toISOString());
      formData.append("latitude", String(coords.latitude));
      formData.append("longitude", String(coords.longitude));
      formData.append("source", "user");
      formData.append("droneId", "0");

      formData.append("photo", {
        uri: image.uri,
        name: "report.jpg",
        type: "image/jpeg",
      } as any);

      await fetch(`${API_BASE_URL}/alert`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert("Success", "Report uploaded!");
      setImage(null);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#FFF8E7] px-5 pt-10">

      {/* TITLE */}
      <Text className="text-2xl font-bold text-black text-center mb-2">
        Upload Sighting Report
      </Text>

      <Text className="text-gray-600 text-center mb-6">
        Take a photo and report elephant activity
      </Text>

      {/* IMAGE PREVIEW CARD */}
      <View className="bg-white rounded-2xl p-4 shadow-md items-center mb-6">

        {image ? (
          <Image
            source={{ uri: image.uri }}
            className="w-full h-64 rounded-xl"
          />
        ) : (
          <View className="w-full h-64 rounded-xl bg-gray-100 items-center justify-center">
            <Ionicons name="camera-outline" size={50} color="#999" />
            <Text className="text-gray-500 mt-2">No image selected</Text>
          </View>
        )}

      </View>

      {/* BUTTONS */}
      <TouchableOpacity
        onPress={takePhoto}
        className="bg-[#FF9F1C] py-4 rounded-xl items-center mb-4 shadow"
      >
        <Text className="text-black font-bold text-lg">
          📷 Take Photo
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={uploadReport}
        disabled={loading}
        className={`py-4 rounded-xl items-center shadow ${
          loading ? "bg-gray-400" : "bg-black"
        }`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold text-lg">
            ⬆ Upload Report
          </Text>
        )}
      </TouchableOpacity>

    </View>
  );
}