import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  useEffect(() => {
  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("authToken");

    if (token) {
      router.replace("/admin/overview");
    } else {
      router.replace("/auth/login");
    }
  };

  checkAuth();
}, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF8E7",
      }}
    >
      <ActivityIndicator size="large" color="#FF9F1C" />
    </View>
  );
}