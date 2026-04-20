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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    const now = new Date().getTime();
    const past = new Date(date).getTime();

    const mins = Math.floor((now - past) / 60000);

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} mins ago`;

    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hrs ago`;

    return new Date(date).toLocaleDateString();
  };

  const renderCard = ({ item }: { item: Sighting }) => (
    <TouchableOpacity
      onPress={() => setSelected(item)}
      className="bg-white rounded-2xl p-4 mb-3 border border-gray-200"
    >
      <View className="flex-row justify-between">
        <View className="flex-row items-center">
          <View
            className={`w-10 h-10 rounded-full items-center justify-center ${
              item.source === "drone" ? "bg-red-500" : "bg-orange-500"
            }`}
          >
            <Ionicons name="warning-outline" size={20} color="white" />
          </View>

          <View className="ml-3">
            <Text className="font-bold text-black text-base">
              Elephant Sighting
            </Text>

            <Text className="text-gray-500 text-xs">
              {getTimeAgo(item.timestamp)}
            </Text>
          </View>
        </View>

        <View
          className={`px-3 py-1 rounded-full ${
            item.source === "drone" ? "bg-red-100" : "bg-yellow-100"
          }`}
        >
          <Text
            className={`text-xs font-bold ${
              item.source === "drone" ? "text-red-600" : "text-yellow-700"
            }`}
          >
            {item.source.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text className="text-sm text-gray-600 mt-3">
        {item.source === "drone"
          ? `Drone ${item.droneId} detected elephant`
          : "User reported elephant sighting"}
      </Text>

      <Text className="text-xs text-gray-400 mt-2">
        📍 {item.latitude}, {item.longitude}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-100 px-4 pt-4">
      {/* Header */}
      <Text className="text-2xl font-bold mb-4 text-black">
        Sighting Alerts
      </Text>

      {/* Stats */}
      <View className="flex-row justify-between mb-4">
        <View className="bg-white p-3 rounded-xl w-[31%]">
          <Text className="text-xs text-gray-500">Total</Text>
          <Text className="text-xl font-bold">{alerts.length}</Text>
        </View>

        <View className="bg-white p-3 rounded-xl w-[31%]">
          <Text className="text-xs text-gray-500">Drone</Text>
          <Text className="text-xl font-bold text-red-500">
            {alerts.filter((a) => a.source === "drone").length}
          </Text>
        </View>

        <View className="bg-white p-3 rounded-xl w-[31%]">
          <Text className="text-xs text-gray-500">Users</Text>
          <Text className="text-xl font-bold text-orange-500">
            {alerts.filter((a) => a.source === "user").length}
          </Text>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={alerts.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() -
            new Date(a.timestamp).getTime()
        )}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCard}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* Modal */}
      <Modal visible={!!selected} animationType="slide">
        {selected && (
          <ScrollView className="flex-1 bg-white p-4">
            <TouchableOpacity
              onPress={() => setSelected(null)}
              className="mb-4"
            >
              <Ionicons name="close" size={30} color="black" />
            </TouchableOpacity>

            <Text className="text-2xl font-bold mb-4">
              Sighting Details
            </Text>

            <Image
              source={{
                uri: `${BASE_URL}/api/sightings/images/${selected.photoFilename}`,
              }}
              className="w-full h-72 rounded-2xl"
              resizeMode="cover"
            />

            <View className="mt-5 space-y-3">
              <Text className="text-base">
                <Text className="font-bold">Source:</Text>{" "}
                {selected.source}
              </Text>

              <Text className="text-base">
                <Text className="font-bold">Verified:</Text>{" "}
                {selected.verified ? "Yes" : "Pending"}
              </Text>

              <Text className="text-base">
                <Text className="font-bold">Location:</Text>{" "}
                {selected.latitude}, {selected.longitude}
              </Text>

              <Text className="text-base">
                <Text className="font-bold">Time:</Text>{" "}
                {new Date(selected.timestamp).toLocaleString()}
              </Text>

              {selected.source === "drone" && (
                <Text className="text-base">
                  <Text className="font-bold">Drone ID:</Text>{" "}
                  {selected.droneId}
                </Text>
              )}
            </View>
          </ScrollView>
        )}
      </Modal>
    </View>
  );
}