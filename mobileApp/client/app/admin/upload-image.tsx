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
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

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
              className={`p-2 rounded-lg mb-2 ${locationMode === "current" ? "bg-green-900" : "bg-gray-100"
                }`}
            >
              <Text className={locationMode === "current" ? "text-white" : "text-black"}>
                Current
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => { setLocationMode("map"); setShowMapModal(true); }}
              className={`p-2 rounded-lg ${locationMode === "map" ? "bg-green-900" : "bg-gray-100"}`}
            >
              <Text className={locationMode === "map" ? "text-white" : "text-black"}>
                Pick Map
              </Text>
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

      {/* 🗺️ FULL SCREEN LOCATION PICKER MODAL */}
      <Modal
        visible={showMapModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowMapModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'white' }}>

          {/* Header for Full Screen Modal */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 60, // Adjust for status bar
            paddingHorizontal: 20,
            paddingBottom: 15,
            borderBottomWidth: 1,
            borderBottomColor: '#eee'
          }}>
            <TouchableOpacity onPress={() => setShowMapModal(false)}>
              <Ionicons name="close" size={28} color="black" />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Select Location</Text>
            <TouchableOpacity
              onPress={() => {
                if (!mapCoords) {
                  Alert.alert("No Location", "Please tap the map to drop a pin first.");
                  return;
                }
                setShowMapModal(false);
                console.log("Selected Coords:", mapCoords);
              }}
            >
              <Text style={{ color: '#007AFF', fontWeight: 'bold', fontSize: 16 }}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* Map Container */}
          <View style={{ flex: 1 }}>
            <MapView
              style={{ flex: 1 }}
              provider={PROVIDER_GOOGLE} // 🚀 Forces Google Maps
              initialRegion={{
                latitude: 7.8731,
                longitude: 80.7718,
                latitudeDelta: 2,
                longitudeDelta: 2,
              }}
              onPress={(e) => setMapCoords(e.nativeEvent.coordinate)}
            >
              {mapCoords && (
                <Marker coordinate={mapCoords} title="Selected Pin" />
              )}
            </MapView>

            {/* Helper Text Overlay */}
            <View style={{
              position: 'absolute',
              top: 20,
              left: 20,
              right: 20,
              backgroundColor: 'rgba(255,255,255,0.9)',
              padding: 10,
              borderRadius: 10,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}>
              <Text style={{ fontSize: 12, color: '#333' }}>
                Tap the map to set the elephant sighting location 📍
              </Text>
            </View>

          </View>
        </View>
      </Modal>

    </View>
  );
}