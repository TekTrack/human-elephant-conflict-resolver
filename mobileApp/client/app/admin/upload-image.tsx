import React, { useState } from "react";
import { View, Text, Button, Image, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "@/config/app"; // Adjust the path as needed

export default function UserReportPage() {
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 📷 Take photo
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  // 📍 Get location
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission denied", "Location permission is required");
      return null;
    }

    let location = await Location.getCurrentPositionAsync({});
    return location.coords;
  };

  // ⬆ Upload to backend
  const uploadReport = async () => {

     
   
    
    if (!image) {
      Alert.alert("Error", "Please take a photo first");
      return;
    }

    setLoading(true);

    try {

       const token = await AsyncStorage.getItem("authToken");

    if (!token) {
      console.log("No token found");
      return;
    }
    
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

      const res = await fetch(`${API_BASE_URL}/alert`, {
        method: "POST",
        body: formData,
        headers: {
           Authorization: `Bearer ${token}`
        },
      });

      const text = await res.text();

      console.log(text);
      Alert.alert("Success", "Report uploaded!");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: "center" }}>

      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
        Report Elephant Sighting
      </Text>

      {image && (
        <Image
          source={{ uri: image.uri }}
          style={{ width: "100%", height: 250, marginBottom: 20 }}
        />
      )}

      <Button title="📷 Take Photo" onPress={takePhoto} />

      <View style={{ height: 10 }} />

      <Button
        title={loading ? "Uploading..." : "⬆ Upload Report"}
        onPress={uploadReport}
      />

      {loading && <ActivityIndicator size="large" />}
    </View>
  );
}