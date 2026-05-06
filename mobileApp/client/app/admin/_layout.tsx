import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import API_BASE_URL from "@/config/app";
import { useState } from "react";
import axios from "axios";

function CustomDrawerContent(props: any) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      router.replace("/auth/login");
    } catch (error) {
      Alert.alert("Error", "Failed to logout.");
    }
  };

  return (
    <View className="flex-1 bg-neutral-950">

      {/* HEADER */}
      <View className="bg-emerald-900 px-5 py-8">
        <View className="flex-row items-center justify-between mb-4">
          
          <View className="bg-emerald-700 p-3 rounded-xl">
            <Ionicons name="shield-checkmark" size={24} color="white" />
          </View>

          <View className="flex-row items-center gap-2 bg-emerald-800 px-3 py-1 rounded-full">
            <View className="w-2 h-2 bg-green-400 rounded-full" />
            <Text className="text-[10px] text-white uppercase">
              Active
            </Text>
          </View>

        </View>

        <Text className="text-white text-lg font-bold">
          Jumbo Watch
        </Text>
        <Text className="text-emerald-200 text-sm">
          Conservation & Protection
        </Text>
      </View>

      {/* MENU */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 10 }}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* LOGOUT */}
      <View className="p-4 border-t border-neutral-800">
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 py-4 rounded-xl items-center"
        >
          <Text className="text-white font-bold">
            Logout
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

export default function AdminLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={({ navigation }) => ({
  headerShown: true,

  headerStyle: {
    backgroundColor: "#0a0a0a",
  },

  headerTintColor: "#22c55e",

  headerTitle: () => (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Ionicons name="shield-checkmark" size={20} color="#22c55e" />
      <Text style={{ color: "#22c55e", fontWeight: "bold", fontSize: 16 }}>
        Jumbo Watch
      </Text>
    </View>
  ),

  headerLeft: () => (
    <TouchableOpacity
      onPress={() => navigation.openDrawer()}
      style={{ marginLeft: 15 }}
    >
      <Ionicons name="menu" size={26} color="#22c55e" />
    </TouchableOpacity>
  ),

  drawerStyle: {
    backgroundColor: "#0a0a0a",
    width: 280,
  },

  drawerActiveTintColor: "#22c55e",
  drawerInactiveTintColor: "#9ca3af",

  drawerLabelStyle: {
    fontSize: 16,
    fontWeight: "600",
  },

  drawerItemStyle: {
    marginVertical: 6,
    borderRadius: 12,
  },
})}
      >

        {/* HOME / OVERVIEW */}
        <Drawer.Screen
          name="home"
          options={{
            title: "Home",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />

        {/* SIGHTINGS */}
        <Drawer.Screen
          name="sighting-alerts"
          options={{
            title: "Sightings",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="warning-outline" size={size} color={color} />
            ),
          }}
        />

        {/* MAP */}
        <Drawer.Screen
          name="geofencing"
          options={{
            title: "Map",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="map-outline" size={size} color={color} />
            ),
          }}
        />

        {/* TRACKING */}
        <Drawer.Screen
          name="tracking"
          options={{
            title: "Tracking",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="radio-outline" size={size} color={color} />
            ),
          }}
        />

        {/* UPLOAD */}
        <Drawer.Screen
          name="upload-image"
          options={{
            title: "Upload",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="cloud-upload-outline" size={size} color={color} />
            ),
          }}
        />

        {/* GUIDE */}
        <Drawer.Screen
          name="Instructions"
          options={{
            title: "Guide",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="book-outline" size={size} color={color} />
            ),
          }}
        />

        {/* PROFILE */}
        <Drawer.Screen
          name="my-profile"
          options={{
            title: "My Profile",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />

      </Drawer>
    </GestureHandlerRootView>
  );
}