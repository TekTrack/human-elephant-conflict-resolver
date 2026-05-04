import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from './app';

export const LOCATION_TASK = 'BACKGROUND_LOCATION_TASK';

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error("Task Error:", error.message);
    return;
  }
  
  if (data) {
    const { locations } = data as any;
    const userLoc = locations[0].coords;

    try {
      // 1. Load zones you saved in GeofencingScreen
      const zonesStr = await AsyncStorage.getItem("savedZones");
      if (!zonesStr) return;
      const zones = JSON.parse(zonesStr);

      // 2. Do the rectangle math!
      let currentZoneId = "Outside Safe Zones";
      for (const zone of zones) {
        if (
          userLoc.latitude >= zone.minLat && userLoc.latitude <= zone.maxLat &&
          userLoc.longitude >= zone.minLon && userLoc.longitude <= zone.maxLon
        ) {
          currentZoneId = zone.name; // Saving the name so it looks nice on the UI!
          break;
        }
      }

      // 3. Only update if they walked into a NEW zone
      const lastZoneId = await AsyncStorage.getItem("currentZoneId");
      
      if (currentZoneId !== lastZoneId) {
        console.log(`Moved to: ${currentZoneId}`);
        await AsyncStorage.setItem("currentZoneId", currentZoneId);

        // 4. Update Spring Boot backend
        if (currentZoneId !== "Outside Safe Zones") {
          const token = await AsyncStorage.getItem("authToken");
          fetch(`${API_BASE_URL}/api/users/updateZone`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ zoneId: currentZoneId }) // Might need to send zone.id if backend expects Long
          }).catch(err => console.log(err));
        }
      }
    } catch (err) {
      console.log("Tracking logic error:", err);
    }
  }
});