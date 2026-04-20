import { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, Switch } from "react-native";
import MapView, { Marker, Polygon, LatLng } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import API_BASE_URL from "@/config/app"; // Adjust the path as needed

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
  droneId?: number;
}

export default function GeofencingScreen() {
  const mapRef = useRef<MapView>(null);

  const [zones, setZones] = useState<Geofence[]>([]);
  const [sightings, setSightings] = useState<Sighting[]>([]);

  const [showUsers, setShowUsers] = useState(true);
  const [showDrones, setShowDrones] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<GeofenceType>("Monitored");

  const [firstPoint, setFirstPoint] = useState<LatLng | null>(null);
  const [secondPoint, setSecondPoint] = useState<LatLng | null>(null);

  useEffect(() => {
    fetchZones();
    fetchSightings();
  }, []);

  // ---------------- API ----------------
  const getToken = async () => {
    return await AsyncStorage.getItem("authToken");
  };

  const fetchZones = async () => {
    const token = await getToken();
    const res = await axios.get(`${BASE_URL}/zones`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setZones(res.data);
  };

  const fetchSightings = async () => {
    const token = await getToken();
    const res = await axios.get(`${BASE_URL}/sightings/filter?timeframe=all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSightings(res.data);
  };

  const saveZone = async () => {
    if (!firstPoint || !secondPoint) return;

    const token = await getToken();

    const zone = {
      name,
      type,
      minLat: Math.min(firstPoint.latitude, secondPoint.latitude),
      maxLat: Math.max(firstPoint.latitude, secondPoint.latitude),
      minLon: Math.min(firstPoint.longitude, secondPoint.longitude),
      maxLon: Math.max(firstPoint.longitude, secondPoint.longitude),
    };

    await axios.post(`${BASE_URL}/zones`, zone, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setModalVisible(false);
    setName("");
    setFirstPoint(null);
    setSecondPoint(null);
    fetchZones();
  };

  // ---------------- MAP TAP ----------------
  const onMapPress = (e: any) => {
    const coord = e.nativeEvent.coordinate;

    if (!firstPoint) {
      setFirstPoint(coord);
    } else {
      setSecondPoint(coord);
      setModalVisible(true);
    }
  };

  // ---------------- UI ----------------
  return (
    <View style={{ flex: 1 }}>

      {/* Header */}
      <View style={{ padding: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Geofencing</Text>

        <TouchableOpacity onPress={fetchZones}>
          <Ionicons name="refresh" size={22} />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        onPress={onMapPress}
        initialRegion={{
          latitude: 7.8731,
          longitude: 80.7718,
          latitudeDelta: 2,
          longitudeDelta: 2,
        }}
      >

        {/* Zones */}
        {zones.map((z) => (
          <Polygon
            key={z.id}
            coordinates={[
              { latitude: z.minLat, longitude: z.minLon },
              { latitude: z.minLat, longitude: z.maxLon },
              { latitude: z.maxLat, longitude: z.maxLon },
              { latitude: z.maxLat, longitude: z.minLon },
            ]}
            strokeColor={
              z.type === "Danger"
                ? "red"
                : z.type === "Caution"
                ? "orange"
                : "blue"
            }
            fillColor="rgba(0,0,255,0.1)"
          />
        ))}

        {/* Sightings */}
        {sightings.map((s) => {
          if (s.source === "user" && !showUsers) return null;
          if (s.source === "drone" && !showDrones) return null;

          return (
            <Marker
              key={s.id}
              coordinate={{
                latitude: s.latitude,
                longitude: s.longitude,
              }}
            >
              <Text style={{ fontSize: 18 }}>
                {s.source === "drone" ? "🚁" : "👤"}
              </Text>
            </Marker>
          );
        })}
      </MapView>

      {/* Bottom Controls */}
      <View style={{ padding: 10, backgroundColor: "white" }}>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text>User Sightings</Text>
            <Switch value={showUsers} onValueChange={setShowUsers} />
          </View>

          <View>
            <Text>Drone Sightings</Text>
            <Switch value={showDrones} onValueChange={setShowDrones} />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            setFirstPoint(null);
            setSecondPoint(null);
          }}
          style={{
            marginTop: 10,
            backgroundColor: "#2563eb",
            padding: 10,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Create Geofence (Tap Map)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Create Zone Modal */}
      <Modal visible={modalVisible} transparent>
        <View style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          padding: 20
        }}>
          <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}>

            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              Create Geofence
            </Text>

            <TextInput
              placeholder="Zone Name"
              value={name}
              onChangeText={setName}
              style={{ borderBottomWidth: 1, marginVertical: 10 }}
            />

            <TouchableOpacity
              onPress={saveZone}
              style={{
                backgroundColor: "green",
                padding: 10,
                borderRadius: 8,
                marginTop: 10
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                Save Zone
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{ marginTop: 10 }}
            >
              <Text style={{ textAlign: "center", color: "red" }}>
                Cancel
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}