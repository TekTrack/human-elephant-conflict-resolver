import React, { useState } from "react";
import { View, Text, Image, Alert, ActivityIndicator, TouchableOpacity, TextInput, Modal, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "@/config/app";
import { Ionicons } from "@expo/vector-icons";

export default function UserReportPage() {
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(1);
  const [description, setDescription] = useState("");
  const [locationMode, setLocationMode] = useState<"current" | "map">("current");
  const [mapCoords, setMapCoords] = useState<{latitude: number, longitude: number} | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);

  // 📷 Image Selection Options
  const handleImagePick = () => {
    Alert.alert("Select Image", "Choose an option", [
      { text: "Take Photo", onPress: takePhoto },
      { text: "Choose from Gallery", onPress: pickFromGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) setImage(result.assets[0]);
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) setImage(result.assets[0]);
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
      Alert.alert("Error", "Please select a photo first");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("authToken");

      // Determine which coordinates to use
      let finalCoords = mapCoords;
      if (locationMode === "current") {
        finalCoords = await getLocation();
      }

      if (!finalCoords) {
        Alert.alert("Error", "Location is required");
        setLoading(false);
        return;
      }

      const formData = new FormData();

      formData.append("count", String(count));
      formData.append("description", description); // <-- Added description
      formData.append("time", new Date().toISOString());
      formData.append("latitude", String(finalCoords.latitude));
      formData.append("longitude", String(finalCoords.longitude));
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
      setCount(1);
      setDescription("");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#FFF8E7] px-5 pt-10" showsVerticalScrollIndicator={false}>
      
      <Text className="text-2xl font-bold text-black text-center mb-2">
        Upload Sighting Report
      </Text>
      <Text className="text-gray-600 text-center mb-6">
        Log elephant activity with details
      </Text>

      {/* 📷 IMAGE PREVIEW */}
      <View className="bg-white rounded-2xl p-4 shadow-md items-center mb-6">
        {image ? (
          <Image source={{ uri: image.uri }} className="w-full h-48 rounded-xl mb-4" />
        ) : (
          <View className="w-full h-48 rounded-xl bg-gray-100 items-center justify-center mb-4">
            <Ionicons name="image-outline" size={50} color="#999" />
            <Text className="text-gray-500 mt-2">No image selected</Text>
          </View>
        )}
        <TouchableOpacity onPress={handleImagePick} className="bg-[#FF9F1C] py-3 px-6 rounded-xl shadow w-full items-center">
          <Text className="text-black font-bold text-lg">Select Photo</Text>
        </TouchableOpacity>
      </View>

      {/* 🐘 COUNT SELECTOR */}
      <View className="bg-white rounded-2xl p-4 shadow-md mb-6 flex-row items-center justify-between">
        <Text className="text-lg font-bold text-black">Elephant Count:</Text>
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity onPress={() => setCount(Math.max(1, count - 1))} className="bg-gray-200 p-2 rounded-full">
            <Ionicons name="remove" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold w-6 text-center">{count}</Text>
          <TouchableOpacity onPress={() => setCount(count + 1)} className="bg-gray-200 p-2 rounded-full">
            <Ionicons name="add" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 📍 LOCATION SELECTOR */}
      <View className="flex-row justify-between mb-6">
        <TouchableOpacity 
          onPress={() => setLocationMode("current")} 
          className={`flex-1 p-4 rounded-xl mr-2 items-center shadow-sm ${locationMode === "current" ? "bg-black" : "bg-white"}`}
        >
          <Text className={`font-bold ${locationMode === "current" ? "text-white" : "text-black"}`}>My Location</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => { setLocationMode("map"); setShowMapModal(true); }} 
          className={`flex-1 p-4 rounded-xl ml-2 items-center shadow-sm ${locationMode === "map" ? "bg-black" : "bg-white"}`}
        >
          <Text className={`font-bold ${locationMode === "map" ? "text-white" : "text-black"}`}>Pick on Map</Text>
        </TouchableOpacity>
      </View>

      {/* 📝 DESCRIPTION FIELD */}
      <TextInput
        placeholder="Optional description (e.g., heading north, aggressive...)"
        value={description}
        onChangeText={setDescription}
        multiline
        className="bg-white p-4 rounded-xl mb-8 h-24 text-black shadow-sm"
        textAlignVertical="top"
      />

      {/* ⬆ UPLOAD BUTTON */}
      <TouchableOpacity
        onPress={uploadReport}
        disabled={loading}
        className={`py-4 rounded-xl items-center shadow mb-10 ${loading ? "bg-gray-400" : "bg-black"}`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold text-lg">⬆ Upload Report</Text>
        )}
      </TouchableOpacity>

      {/* 🗺️ MAP MODAL (Placeholder for your map component) */}
      <Modal visible={showMapModal} animationType="slide" transparent={true}>
        <View className="flex-1 bg-black/50 justify-center items-center p-5">
          <View className="bg-white w-full p-5 rounded-2xl">
            <Text className="text-lg font-bold mb-4">Select Location</Text>
            
            {/* TODO: Insert react-native-maps <MapView> here! */}
            <View className="w-full h-64 bg-gray-200 items-center justify-center rounded-xl mb-4">
               <Text className="text-gray-500 text-center">Map Component Goes Here 🗺️</Text>
               <Text className="text-xs text-gray-400 mt-2">(Simulating selection for now)</Text>
            </View>

            <TouchableOpacity 
              onPress={() => {
                setMapCoords({ latitude: 6.9271, longitude: 79.8612 }); // Dummy data until Map is wired
                setShowMapModal(false);
              }} 
              className="bg-[#FF9F1C] py-3 rounded-xl items-center"
            >
              <Text className="text-black font-bold text-lg">Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}