import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import API_BASE_URL from './app';
import { Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const GEOFENCE_TASK = 'BACKGROUND_GEOFENCE_TASK';

interface GeofenceData {
  eventType: Location.GeofencingEventType;
  region: Location.LocationRegion;
}

TaskManager.defineTask(GEOFENCE_TASK, async (body) => {
  if (body.error) {
    console.error("Geofence Error:", body.error.message);
    return;
  }

  const { eventType, region } = body.data as unknown as GeofenceData;

  if (eventType === Location.GeofencingEventType.Enter) {
    console.log("Entered Zone:", region.identifier);
    await AsyncStorage.setItem("currentZoneId", region.identifier || "");
    
    // 1. Get the saved JWT token
    const token = await AsyncStorage.getItem("authToken");

    // 2. Send with Authorization header
    fetch(`${API_BASE_URL}/api/users/updateZone`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ zoneId: region.identifier }) 
    }).catch(err => console.log("Failed to update backend:", err));
  }else if (eventType === Location.GeofencingEventType.Exit) {
    // 👇 Handle leaving the zone!
    console.log("Exited Zone:", region.identifier);
    await AsyncStorage.setItem("currentZoneId", "Outside Safe Zones");
  }
});