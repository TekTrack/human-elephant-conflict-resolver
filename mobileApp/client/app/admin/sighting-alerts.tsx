 import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import API_BASE_URL from "@/config/app";

interface Sighting {
  id: number;
  photoFilename: string;
  verified: boolean;
  latitude: number;
  longitude: number;
  timestamp: string;
  source: "user" | "drone";
  droneId: number;
}

export default function SightingAlertsScreen() {
  const [alerts, setAlerts] = useState<Sighting[]>([]);
  const [selected, setSelected] = useState<Sighting | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "drone" | "user">("all");

  const BASE_URL = API_BASE_URL;

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      const res = await axios.get(
        `${BASE_URL}/api/admin/sightings/filter?timeframe=all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAlerts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAlerts();
    setRefreshing(false);
  };

  const getTimeAgo = (date: string) => {
    const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} mins ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hrs ago`;
    return new Date(date).toLocaleDateString();
  };

  // 🔥 CARD UI (NEW)
  const renderCard = ({ item }: { item: Sighting }) => (
    <TouchableOpacity
      onPress={() => setSelected(item)}
      className="bg-white rounded-2xl mb-5 overflow-hidden border border-gray-200"
    >
      {/* IMAGE */}
      {item.photoFilename && (
        <View className="h-48">
          <Image
            source={{
              uri: `${item.photoFilename}`,
            }}
            className="w-full h-full"
          />

          {/* BADGE */}
          <View
            className={`absolute top-3 left-3 px-3 py-1 rounded-full flex-row items-center ${
              item.source === "drone" ? "bg-red-500" : "bg-orange-500"
            }`}
          >
            <Ionicons
              name={item.source === "drone" ? "videocam" : "person"}
              size={14}
              color="white"
            />
            <Text className="text-white text-xs font-bold ml-1">
              {item.source.toUpperCase()}
            </Text>
          </View>
        </View>
      )}

      {/* CONTENT */}
      <View className="p-4">
        <View className="flex-row justify-between mb-2">
          <Text className="text-lg font-bold text-green-900">
            Elephant Sighting
          </Text>
          <Text className="text-xs text-gray-500">
            {getTimeAgo(item.timestamp)}
          </Text>
        </View>

        <View className="flex-row items-center mb-2">
          <Ionicons name="location" size={16} color="gray" />
          <Text className="text-gray-600 ml-1 text-sm">
            {item.latitude}, {item.longitude}
          </Text>
        </View>

        <Text className="text-gray-700 mb-3 text-sm">
          {item.source === "drone"
            ? `Drone ${item.droneId} detected elephant movement`
            : "User reported elephant sighting"}
        </Text>

        {/* ACTIONS */}
        <View className="flex-row gap-2">
          <TouchableOpacity className="flex-1 bg-green-900 py-2 rounded-lg">
            <Text className="text-white text-center font-semibold">
              View Map
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="px-4 py-2 border border-gray-300 rounded-lg">
            <Text className="text-gray-600 font-semibold">
              Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );


  const filteredAlerts = alerts
  .slice()
  .sort(
    (a, b) =>
      new Date(b.timestamp).getTime() -
      new Date(a.timestamp).getTime()
  )
  .filter((item) => {
    if (filter === "all") return true;
    if (filter === "drone") return item.source === "drone";
    if (filter === "user") return item.source === "user";
    return true;
  });

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-4">

      {/* TITLE */}
      <View className="mb-4">
        <Text className="text-2xl font-bold text-green-900">
          Sighting Alerts
        </Text>
        <Text className="text-gray-500 text-sm">
          Real-time wildlife updates
        </Text>
      </View>

      {/* STATS */}
      <View className="flex-row justify-between mb-4">
        <View className="bg-white p-3 rounded-xl w-[31%] items-center">
          <Text className="text-lg font-bold text-green-900">
            {alerts.length}
          </Text>
          <Text className="text-xs text-gray-500">Total</Text>
        </View>

        <View className="bg-white p-3 rounded-xl w-[31%] items-center">
          <Text className="text-lg font-bold text-red-500">
            {alerts.filter((a) => a.source === "drone").length}
          </Text>
          <Text className="text-xs text-gray-500">Drone</Text>
        </View>

        <View className="bg-white p-3 rounded-xl w-[31%] items-center">
          <Text className="text-lg font-bold text-orange-500">
            {alerts.filter((a) => a.source === "user").length}
          </Text>
          <Text className="text-xs text-gray-500">Users</Text>
        </View>
      </View>

       {/* FILTER SECTION */}
<View className="mb-4">

  <Text className="text-sm font-semibold text-gray-500 mb-2">
    Filter Alerts
  </Text>

  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    <View className="flex-row gap-3">

      {/* ALL */}
      <TouchableOpacity
        onPress={() => setFilter("all")}
        className={`px-5 py-2 rounded-full ${
          filter === "all" ? "bg-green-900" : "bg-white border border-gray-300"
        }`}
      >
        <Text
          className={`text-xs font-bold ${
            filter === "all" ? "text-white" : "text-gray-700"
          }`}
        >
          All Alerts
        </Text>
      </TouchableOpacity>

      {/* DRONE */}
      <TouchableOpacity
        onPress={() => setFilter("drone")}
        className={`px-5 py-2 rounded-full ${
          filter === "drone" ? "bg-green-900" : "bg-white border border-gray-300"
        }`}
      >
        <Text
          className={`text-xs font-bold ${
            filter === "drone" ? "text-white" : "text-gray-700"
          }`}
        >
          Drone Only
        </Text>
      </TouchableOpacity>

      {/* USER */}
      <TouchableOpacity
        onPress={() => setFilter("user")}
        className={`px-5 py-2 rounded-full ${
          filter === "user" ? "bg-green-900" : "bg-white border border-gray-300"
        }`}
      >
        <Text
          className={`text-xs font-bold ${
            filter === "user" ? "text-white" : "text-gray-700"
          }`}
        >
          User Reports
        </Text>
      </TouchableOpacity>

    </View>
  </ScrollView>

</View>
 

      {/* LIST */}
      <FlatList
        data={filteredAlerts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCard}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* MODAL */}
      <Modal visible={!!selected} animationType="slide">
        {selected && (
          <ScrollView className="flex-1 bg-white p-4">
            <TouchableOpacity onPress={() => setSelected(null)}>
              <Ionicons name="close" size={30} />
            </TouchableOpacity>

            <Image
              source={{
                uri: `${selected.photoFilename}`,
              }}
              className="w-full h-72 rounded-xl mt-3"
            />

            <Text className="text-xl font-bold mt-4">
              Sighting Details
            </Text>

            <Text className="mt-2">
              Source: {selected.source}
            </Text>
            <Text>
              Verified: {selected.verified ? "Yes" : "No"}
            </Text>
            <Text>
              Location: {selected.latitude}, {selected.longitude}
            </Text>
          </ScrollView>
        )}
      </Modal>
    </View>
  );
}