import * as TaskManager from 'expo-task-manager';
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from './app';

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
      if (!zonesStr) {
        console.log("⚠️ savedZones missing in background task");
        return;
      }

      const zones = JSON.parse(zonesStr);
      const matchedZone = matchZone(userLoc, zones);

      const currentZoneName = matchedZone ? matchedZone.name : "Outside Safe Zones";
      const currentZoneIdToSend = matchedZone ? matchedZone.id : null;

      const lastZoneName = await AsyncStorage.getItem("currentZoneName");

      if (currentZoneName !== lastZoneName) {
        console.log(`🚨 Zone changed: ${lastZoneName} → ${currentZoneName}`);
        await AsyncStorage.setItem("currentZoneName", currentZoneName);

        const token = await AsyncStorage.getItem("authToken");
        fetch(`${API_BASE_URL}/api/users/updateZone`, {
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