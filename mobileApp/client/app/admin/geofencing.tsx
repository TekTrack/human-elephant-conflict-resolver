import { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import API_BASE_URL from "@/config/app";
import { fetchZonesData } from "../services/zoneService";

const BASE_URL = `${API_BASE_URL}/api/admin`;

type GeofenceType = "Caution" | "Monitored" | "Danger";

interface Geofence {
  id: number;
  name: string;
  type: GeofenceType;
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

interface Sighting {
  id: number;
  latitude: number;
  longitude: number;
  source: "user" | "drone";
  timestamp: string;
}

const ZONE_COLORS: Record<GeofenceType, { stroke: string; fill: string }> = {
  Danger:    { stroke: "red",    fill: "rgba(255,0,0,0.15)"   },
  Caution:   { stroke: "orange", fill: "rgba(255,165,0,0.15)" },
  Monitored: { stroke: "blue",   fill: "rgba(0,0,255,0.10)"   },
};

export default function GeofencingScreen() {
  const mapRef = useRef<MapView>(null);

  const [zones, setZones] = useState<Geofence[]>([]);
  const [sightings, setSightings] = useState<Sighting[]>([]);

  const [showUsers, setShowUsers] = useState(true);
  const [showDrones, setShowDrones] = useState(true);

  useEffect(() => {
    fetchZones();
    fetchSightings();
  }, []);

  const getToken = async () => {
    return await AsyncStorage.getItem("authToken");
  };

  const fetchZones = async () => {
    try {
      const data = await fetchZonesData();
      setZones(data);
    } catch (err) {
      console.error("Failed to load zones:", err);
    }
  };

  const fetchSightings = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(
        `${BASE_URL}/sightings/filter?timeframe=all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSightings(res.data);
    } catch (err) {
      console.error("Failed to load sightings:", err);
    }
  };

  return (
    <View style={{ flex: 1 }}>

      {/* Header */}
      <View
        style={{
          padding: 15,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Live Map</Text>

        <TouchableOpacity onPress={() => { fetchZones(); fetchSightings(); }}>
          <Ionicons name="refresh" size={22} />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE} // 🚀 Forces Google Maps
        initialRegion={{
          latitude: 7.8731,
          longitude: 80.7718,
          latitudeDelta: 2,
          longitudeDelta: 2,
        }}
      >
        {/* Zones */}
        {zones.map((z) => {
          const colors = ZONE_COLORS[z.type] ?? ZONE_COLORS.Monitored;
          return (
            <Polygon
              key={z.id}
              coordinates={[
                { latitude: z.minLat, longitude: z.minLon },
                { latitude: z.minLat, longitude: z.maxLon },
                { latitude: z.maxLat, longitude: z.maxLon },
                { latitude: z.maxLat, longitude: z.minLon },
              ]}
              strokeColor={colors.stroke}
              fillColor={colors.fill}
            />
          );
        })}

        {/* Sightings */}
        {sightings.map((s) => {
          if (s.source === "user" && !showUsers) return null;
          if (s.source === "drone" && !showDrones) return null;

          return (
            <Marker
              key={s.id}
              coordinate={{ latitude: s.latitude, longitude: s.longitude }}
            >
              <Text style={{ fontSize: 18 }}>
                {s.source === "drone" ? "🚁" : "👤"}
              </Text>
            </Marker>
          );
        })}
      </MapView>

      {/* Bottom Controls */}
      <View style={{ padding: 10, backgroundColor: "white", elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ marginBottom: 5 }}>User Sightings</Text>
            <Switch value={showUsers} onValueChange={setShowUsers} />
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ marginBottom: 5 }}>Drone Sightings</Text>
            <Switch value={showDrones} onValueChange={setShowDrones} />
          </View>
        </View>
      </View>

    </View>
  );
}