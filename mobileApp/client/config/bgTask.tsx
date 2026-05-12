import * as TaskManager from 'expo-task-manager';
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from '@/config/app'; // ✅ FIX: was './app' — caused API_BASE_URL to be undefined in bg context
import { sendZoneNotification } from '../app/services/notificationService'; 

export const LOCATION_TASK = 'BACKGROUND_LOCATION_TASK';

export const matchZone = (coords: { latitude: number; longitude: number }, zones: any[]) => {
  for (const zone of zones) {
    const trueMinLat = Math.min(zone.minLat, zone.maxLat);
    const trueMaxLat = Math.max(zone.minLat, zone.maxLat);
    const trueMinLon = Math.min(zone.minLon, zone.maxLon);
    const trueMaxLon = Math.max(zone.minLon, zone.maxLon);

    if (
      coords.latitude >= trueMinLat && coords.latitude <= trueMaxLat &&
      coords.longitude >= trueMinLon && coords.longitude <= trueMaxLon
    ) {
      return zone;
    }
  }
  return null;
};

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error("Task Error:", error.message);
    return;
  }

  if (data) {
    const { locations } = data as any;
    const userLoc = locations[0].coords;

    try {
      const zonesStr = await AsyncStorage.getItem("savedZones");
      if (!zonesStr) return;

      const zones = JSON.parse(zonesStr);
      if (!Array.isArray(zones) || zones.length === 0) return; // ✅ FIX: guard against null/non-array parse result

      const matchedZone = matchZone(userLoc, zones);

      const currentZoneName = matchedZone ? matchedZone.name : "Outside Safe Zones";
      const currentZoneIdToSend = matchedZone ? matchedZone.id : null;

      const lastZoneName = await AsyncStorage.getItem("currentZoneName");

      if (currentZoneName !== lastZoneName) {
        console.log(`🚨 Zone changed: ${lastZoneName} → ${currentZoneName}`);
        await AsyncStorage.setItem("currentZoneName", currentZoneName);

        await sendZoneNotification(currentZoneName);

        const token = await AsyncStorage.getItem("authToken");
        fetch(`${API_BASE_URL}/api/users/updateZone`, { // ✅ now uses the correct base URL
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ zoneId: currentZoneIdToSend })
        }).catch(err => console.log("Backend update failed:", err));
      }
    } catch (err) {
      console.error("🔥 FATAL BACKGROUND ERROR:", err);
    }
  }
});
