import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text, TouchableOpacity,Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

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
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerStyle: {
            backgroundColor: "#F8BD00",
          },
          drawerActiveTintColor: "#000",
          drawerInactiveTintColor: "#333",

          drawerLabelStyle: {
              fontSize: 23,
              fontWeight: "600",
            },
            drawerItemStyle: {
              marginVertical: 17,
            },
        }}
      >

        <Drawer.Screen
          name="overview"
          options={{
            title: "Home",
            drawerItemStyle: {
      marginTop: 80,
    },
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="sighting-alerts"
          options={{
            title: "Sightings",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="warning" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="geofencing"
          options={{
            title: "Map",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="map" size={size} color={color} />
            ),
          }}
        />

        

        <Drawer.Screen
          name="upload-image"
          options={{
            title: "Upload",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="camera" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="Instructions"
          options={{
            title: "Guide",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="book" size={size} color={color} />
            ),
          }}
        />

        

        <Drawer.Screen
          name="my-profile"
          options={{
            title: "My Profile",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="people" size={size} color={color} />
            ),
          }}
        />

      </Drawer>
    </GestureHandlerRootView>
  );
}