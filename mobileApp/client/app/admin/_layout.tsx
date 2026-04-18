import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text, TouchableOpacity,Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

function CustomDrawerContent(props: any) {

  const router = useRouter();
  
  const handleLogout = async () => {
   try {
     await AsyncStorage.removeItem("authToken");
      router.replace("/auth/login");
       
      console.log("Logged out successfully");

   } catch (error) {
    console.error("Logout Error:", error);
     Alert.alert("Error", "Failed to logout. Please try again.");
   }
  };

  return (
    <View className="flex-1">

    {/* MENU */}
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <DrawerItemList {...props} />
    </DrawerContentScrollView>

    {/* LOGOUT AREA (slightly up) */}
    <View className="border-t border-gray-300 px-4 pb-9 pt-3">
      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-100 py-3 rounded-xl items-center"
      >
        <Text className="text-red-600 font-bold">
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
      <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="overview" />
        <Drawer.Screen name="live-monitor" />
        <Drawer.Screen name="drone-map" />
        <Drawer.Screen name="sighting-alerts" />
        <Drawer.Screen name="geofencing" />
        <Drawer.Screen name="users-list" />

      </Drawer>
    </GestureHandlerRootView>
  );
}