import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://YOUR_API_URL";

export default function LiveMonitorScreen() {
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDrone, setSelectedDrone] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fetching, setFetching] = useState(false);

  // 🔥 FETCH DRONES
  const fetchDrones = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("authToken");

      const res = await fetch(`${BASE_URL}/drones`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setDrones(data.data || data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrones();
  }, []);

  // 🔥 FETCH LIVE FEED
  const openDrone = async (drone: any) => {
    setSelectedDrone(drone);
    setModalVisible(true);
    setFetching(true);

    const token = await AsyncStorage.getItem("authToken");

    try {
      const res = await fetch(
        `${BASE_URL}/liveDroneFeed/${drone.id}?t=${Date.now()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
    } catch (err) {
      console.log(err);
    } finally {
      setFetching(false);
    }
  };

  return (
    <View className="flex-1 bg-[#FFF8E7] p-5">

      {/* Header */}
      <Text className="text-3xl font-bold mb-4">Live Monitor</Text>

      {/* Loading */}
      {loading && (
        <ActivityIndicator size="large" color="#FF9F1C" />
      )}

      {/* Drone List */}
      <FlatList
        data={drones}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }: any) => (
          <TouchableOpacity
            onPress={() => openDrone(item)}
            className="bg-white p-4 rounded-xl mb-3 flex-row justify-between items-center"
          >
            <View>
              <Text className="font-bold">Drone {item.id}</Text>
              <Text className="text-gray-500 text-sm">
                {item.coordinates || "Unknown"}
              </Text>
            </View>

            <View
              className={`px-3 py-1 rounded-full ${
                item.active ? "bg-green-200" : "bg-yellow-200"
              }`}
            >
              <Text className="text-xs font-bold">
                {item.active ? "LIVE" : "MAINTENANCE"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* LIVE MODAL */}
      <Modal visible={modalVisible} animationType="slide">
        <View className="flex-1 bg-black p-4">

          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-xl font-bold">
              Drone {selectedDrone?.id}
            </Text>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text className="text-red-400 text-lg">Close</Text>
            </TouchableOpacity>
          </View>

          {/* Video */}
          <View className="flex-1 justify-center items-center">
            {fetching && (
              <ActivityIndicator size="large" color="white" />
            )}

            {videoUrl && !fetching && (
              <Image
                source={{ uri: videoUrl }}
                className="w-full h-80"
                resizeMode="contain"
              />
            )}
          </View>

        </View>
      </Modal>
    </View>
  );
}