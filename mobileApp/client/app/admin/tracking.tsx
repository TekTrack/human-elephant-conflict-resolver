import React, { useState, useEffect } from "react";
import { View, Text, Switch, Alert, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { GEOFENCE_TASK } from "@/config/bgTask";

export default function Tracking() {
  const [isTracking, setIsTracking] = useState(false);
  const [currentZone, setCurrentZone] = useState("Checking...");
  const [isLoading, setIsLoading] = useState(true);

  // Check if tracking is active when page loads
  useEffect(() => {
    checkTrackingStatus();
  }, []);

  const checkTrackingStatus = async () => {
    try {
      // 1. Check if the task is currently running
      const isRegistered = await TaskManager.isTaskRegisteredAsync(GEOFENCE_TASK);
      setIsTracking(isRegistered);

      // 2. Get the last known zone from storage
      const savedZone = await AsyncStorage.getItem("currentZoneId");
      setCurrentZone(savedZone || "Outside All Zones");
    } catch (error) {
      console.log("Error checking status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTracking = async (value: boolean) => {
    try {
      if (value) {
        // TURN ON 🟢
        const { status: fg } = await Location.requestForegroundPermissionsAsync();
        if (fg !== "granted") return Alert.alert("Foreground permission required");

        const { status: bg } = await Location.requestBackgroundPermissionsAsync();
        if (bg !== "granted") return Alert.alert("Background permission required");

        await Location.startGeofencingAsync(GEOFENCE_TASK, [
          {
            identifier: "ZONE_001",
            latitude: 5.9549,
            longitude: 80.5469,
            radius: 500,
            notifyOnEnter: true,
            notifyOnExit: true, // Need this to know when they leave!
          },
        ]);
        setIsTracking(true);
      } else {
        // TURN OFF 🔴
        await Location.stopGeofencingAsync(GEOFENCE_TASK);
        setIsTracking(false);
        setCurrentZone("Tracking Disabled");
        await AsyncStorage.removeItem("currentZoneId");
      }
    } catch (error) {
      Alert.alert("Error", "Could not change tracking state.");
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50">
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neutral-50 p-6">
      
      {/* STATUS CARD */}
      <View className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 mb-6 flex-row items-center justify-between">
        <View>
          <Text className="text-neutral-500 font-semibold mb-1">Master Control</Text>
          <Text className="text-2xl font-bold text-neutral-800">
            {isTracking ? "Tracking Active" : "Tracking Paused"}
          </Text>
        </View>
        <Switch
          trackColor={{ false: "#e5e7eb", true: "#34d399" }}
          thumbColor={isTracking ? "#059669" : "#f4f3f4"}
          onValueChange={toggleTracking}
          value={isTracking}
          style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
        />
      </View>

      {/* ZONE DETAILS CARD */}
      <View className="bg-emerald-900 rounded-2xl p-6 shadow-md relative overflow-hidden">
        {/* Decorative background icon */}
        <Ionicons name="map" size={120} color="rgba(255,255,255,0.05)" style={{ position: 'absolute', right: -20, bottom: -20 }} />
        
        <View className="flex-row items-center gap-3 mb-4">
          <View className="bg-emerald-800 p-3 rounded-full">
            <Ionicons name="location" size={24} color="#34d399" />
          </View>
          <Text className="text-emerald-100 text-lg font-bold">Current Location</Text>
        </View>

        <Text className="text-white text-3xl font-black mb-2">
          {currentZone}
        </Text>
        
        <Text className="text-emerald-200">
          {isTracking 
            ? "Your location is being securely monitored for elephant alerts." 
            : "Turn on tracking to receive zone-specific alerts."}
        </Text>
      </View>

    </View>
  );
}