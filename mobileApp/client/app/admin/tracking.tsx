import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Switch, Alert, ActivityIndicator, AppState } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { LOCATION_TASK } from "@/config/bgTask";
import { fetchZonesData } from "../services/zoneService";

export default function Tracking() {
  const [isTracking, setIsTracking] = useState(false);
  const [currentZone, setCurrentZone] = useState("Outside Safe Zones");
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Single init on mount — check task status and restore last known zone
  useEffect(() => {
    const init = async () => {
      try {
        const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK);
        setIsTracking(isRegistered);

        if (isRegistered) {
          const savedZone = await AsyncStorage.getItem("currentZoneName");
          if (savedZone) setCurrentZone(savedZone);
        }
      } catch (e) {
        console.log("Init error:", e);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // ✅ Refresh zone display whenever the app comes back to the foreground
  useEffect(() => {
    const subscription = AppState.addEventListener("change", async (nextState) => {
      if (nextState === "active") {
        const savedZone = await AsyncStorage.getItem("currentZoneName");
        if (savedZone) setCurrentZone(savedZone);
      }
    });
    return () => subscription.remove();
  }, []);

  // ✅ Poll AsyncStorage for zone updates written by the background task
  useEffect(() => {
    if (!isTracking) return;
    const interval = setInterval(async () => {
      const savedZone = await AsyncStorage.getItem("currentZoneName");
      if (savedZone) setCurrentZone(savedZone);
    }, 3000);
    return () => clearInterval(interval);
  }, [isTracking]);

  const toggleTracking = useCallback(async (value: boolean) => {
    if (value) {
      const { status: fg } = await Location.requestForegroundPermissionsAsync();
      if (fg !== "granted") return Alert.alert("Foreground permission required");

      const { status: bg } = await Location.requestBackgroundPermissionsAsync();
      if (bg !== "granted") return Alert.alert("Background permission required");

      // ✅ FIX: removed the unreachable third permission check that was here

      setIsLoading(true);

      try {
        // 1. Fetch fresh zones and persist them before the bg task can read them
        await fetchZonesData();

        // 2. ✅ FIX: Clear any stale zone name from a previous session.
        //    Without this, the poll immediately shows old AsyncStorage data,
        //    making it look like the zone is correct — until the background
        //    task runs and overwrites it with the real current position result.
        await AsyncStorage.removeItem("currentZoneName");

        // 3. Start location updates only after zones are safely on disk
        await Location.startLocationUpdatesAsync(LOCATION_TASK, {
          accuracy: Location.Accuracy.Balanced, // ✅ FIX: was High — Balanced is sufficient for zone tracking and saves battery
          distanceInterval: 20, // ✅ FIX: was 1 — firing every 1 m causes GPS jitter
          //                         and drains battery. 20 m is a sensible minimum.
          timeInterval: 10000,   // ✅ FIX: was 2000 — 5 s is plenty for zone tracking
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: "Live Zone Tracking",
            notificationBody: "Monitoring zones safely.",
            notificationColor: "#059669",
          },
        });

        setIsTracking(true);
        // Background task will write the real zone name on its first run
        setCurrentZone("Locating...");
      } catch (e) {
        Alert.alert("Error", "Failed to initialize tracking data.");
      } finally {
        setIsLoading(false);
      }

    } else {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK);
      await AsyncStorage.removeItem("currentZoneName"); // ✅ cleaner than multiRemove for a single key
      setIsTracking(false);
      setCurrentZone("Outside Safe Zones");
    }
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50">
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neutral-50 p-6">
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

      <View className="bg-emerald-900 rounded-2xl p-6 shadow-md relative overflow-hidden">
        <Ionicons name="map" size={120} color="rgba(255,255,255,0.05)"
          style={{ position: 'absolute', right: -20, bottom: -20 }} />
        <View className="flex-row items-center gap-3 mb-4">
          <View className="bg-emerald-800 p-3 rounded-full">
            <Ionicons name="location" size={24} color="#34d399" />
          </View>
          <Text className="text-emerald-100 text-lg font-bold">Current Location</Text>
        </View>
        <Text className="text-white text-3xl font-black mb-2">{currentZone}</Text>
        <Text className="text-emerald-200">
          {isTracking
            ? "Your location is being securely monitored for alerts."
            : "Turn on tracking to receive zone-specific alerts."}
        </Text>
      </View>
    </View>
  );
}
