import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "@/config/app";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";

export default function UserReportPage() {
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(1);
  const [description, setDescription] = useState("");
  const [locationMode, setLocationMode] = useState<"current" | "map">("current");
  const [mapCoords, setMapCoords] = useState<any>(null);
  const [showMapModal, setShowMapModal] = useState(false);

  // IMAGE PICK
  const handleImagePick = () => {
    Alert.alert("Select Image", "Choose option", [
      { text: "Camera", onPress: takePhoto },
      { text: "Gallery", onPress: pickFromGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: true,
    });
    if (!result.canceled) setImage(result.assets[0]);
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      allowsEditing: true,
    });
    if (!result.canceled) setImage(result.assets[0]);
  };

  // LOCATION
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return null;

    let loc = await Location.getCurrentPositionAsync({});
    return loc.coords;
  };

  // UPLOAD
  const uploadReport = async () => {
    if (!image) return Alert.alert("Select image first");

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("authToken");

      let coords = mapCoords;
      if (locationMode === "current") coords = await getLocation();

      if (!coords) {
        setLoading(false);
        return Alert.alert("Location required");
      }

      const formData = new FormData();

      formData.append("count", String(count));
      formData.append("description", description);
      formData.append("latitude", String(coords.latitude));
      formData.append("longitude", String(coords.longitude));
      formData.append("time", new Date().toISOString());
      formData.append("source", "user");

      formData.append("photo", {
        uri: image.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      } as any);

      await fetch(`${API_BASE_URL}/alert`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert("Success", "Report uploaded");

      setImage(null);
      setCount(1);
      setDescription("");
    } catch (err) {
      Alert.alert("Error", "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#fcf9f8] pb-20">

      {/* TOP BAR */}
      <View className="flex-row justify-between items-center px-4 h-16 bg-white border-b border-gray-200">
        <View className="flex-row items-center gap-2">
          <Ionicons name="shield-checkmark" size={22} color="#064e3b" />
          <Text className="text-xl font-black text-emerald-900">
            Jumbo Watch
          </Text>
        </View>

        <Ionicons name="notifications-outline" size={22} color="gray" />
      </View>

      <ScrollView className="px-4 py-5">

        {/* TITLE */}
        <Text className="text-2xl font-bold text-black mb-1">
          Report Sighting
        </Text>
        <Text className="text-gray-500 mb-6">
          Log elephant activity with details to keep community informed
        </Text>

        {/* IMAGE CARD */}
        <View className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">

          {image ? (
            <Image source={{ uri: image.uri }} className="w-full h-52" />
          ) : (
            <View className="h-52 items-center justify-center bg-gray-100">
              <Ionicons name="camera-outline" size={40} color="#999" />
              <Text className="text-gray-500 mt-2">
                Capture or Upload Sighting
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleImagePick}
            className="bg-[#012d1d] py-3 items-center"
          >
            <Text className="text-white font-bold">Select Photo</Text>
          </TouchableOpacity>
        </View>

        {/* BENTO GRID */}
        <View className="flex-row gap-3 mb-6">

          {/* COUNT */}
          <View className="flex-1 bg-white p-4 rounded-2xl border border-gray-200 items-center">
            <Text className="text-gray-500 text-xs mb-2">
              Elephant Count
            </Text>

            <View className="flex-row items-center gap-4">
              <TouchableOpacity onPress={() => setCount(Math.max(1, count - 1))}>
                <Ionicons name="remove-circle-outline" size={28} />
              </TouchableOpacity>

              <Text className="text-2xl font-bold">{count}</Text>

              <TouchableOpacity onPress={() => setCount(count + 1)}>
                <Ionicons name="add-circle-outline" size={28} />
              </TouchableOpacity>
            </View>
          </View>

          {/* LOCATION */}
          <View className="flex-1 bg-white p-4 rounded-2xl border border-gray-200">
            <Text className="text-gray-500 text-xs mb-2">Location</Text>

            <TouchableOpacity
              onPress={() => setLocationMode("current")}
              className={`p-2 rounded-lg mb-2 ${
                locationMode === "current" ? "bg-green-900" : "bg-gray-100"
              }`}
            >
              <Text className={locationMode === "current" ? "text-white" : "text-black"}>
                Current
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowMapModal(true)}
              className="p-2 rounded-lg bg-gray-100"
            >
              <Text>Pick Map</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DESCRIPTION */}
        <View className="bg-white p-4 rounded-2xl border border-gray-200 mb-6">
          <Text className="text-xs text-gray-500 mb-2">
            Behavior & Details
          </Text>

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Elephant heading north, aggressive..."
            multiline
            className="h-24"
            textAlignVertical="top"
          />
        </View>

        {/* UPLOAD */}
        <TouchableOpacity
          onPress={uploadReport}
          className="bg-[#4d1100] py-4 rounded-2xl items-center mb-10"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-lg">
              Upload Report
            </Text>
          )}
        </TouchableOpacity>

      </ScrollView>

      {/* MAP MODAL */}
      <Modal visible={showMapModal} animationType="slide">
        <View className="flex-1">

          <MapView
            style={{ flex: 1 }}
            onPress={(e) => setMapCoords(e.nativeEvent.coordinate)}
          >
            {mapCoords && <Marker coordinate={mapCoords} />}
          </MapView>

          <TouchableOpacity
            onPress={() => setShowMapModal(false)}
            className="bg-black p-4"
          >
            <Text className="text-white text-center font-bold">
              Confirm Location
            </Text>
          </TouchableOpacity>

        </View>
      </Modal>

    </View>
  );
}