import { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity } from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"; 

interface User {
  id: string | number;
  displayName: string;
  displayEmail: string;
  displayPhone: string;
  role: "Admin" | "User";
  status: "Active" | "Inactive";
}

export default function UserListScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken"); // replace AsyncStorage if needed
      console.log("Fetching users with token:", token);

      const [userRes, adminRes] = await Promise.all([
        axios.get("http://10.17.66.70:8080/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://10.17.66.70:8080/api/admin/alladmins", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const usersMapped = (userRes.data.data || []).map((u) => ({
          id: u.email || "",
          displayName: u.name || "Unknown User",
          displayEmail: u.email || "No Email",
          displayPhone: u.phoneNumber || "-",
          role: "User",
          status: "Active",
        }));

      const adminsMapped = (adminRes.data.data || []).map((a: any) => ({
        id: a.adminId,
        displayName: a.name,
        displayEmail: a.email,
        displayPhone: a.phone,
        role: "Admin",
        status: "Active",
      }));

      setUsers([...adminsMapped, ...usersMapped]);
    } catch (err) {
      console.log(err);
    }
  };

  const normalize = (text) => (text || "").toLowerCase();

const filtered = users.filter((u) =>
  normalize(u.displayName).includes(normalize(search)) ||
  normalize(u.displayEmail).includes(normalize(search))
);

  const UserCard = ({ item }: { item: User }) => (
    <View className="bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl mb-3 border border-gray-100 dark:border-white/10">
      
      {/* Top row */}
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center gap-3">
          
          {/* Avatar */}
          <View
            className={`w-10 h-10 rounded-full items-center justify-center ${
              item.role === "Admin" ? "bg-purple-600" : "bg-blue-600"
            }`}
          >
            <Text className="text-white font-bold">
              {item.displayName.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View>
            <Text className="font-bold text-black dark:text-white">
              {item.displayName}
            </Text>
            <Text className="text-xs text-gray-500">
              {item.displayEmail}
            </Text>
          </View>
        </View>

        {/* Role badge */}
        <View
          className={`px-3 py-1 rounded-full ${
            item.role === "Admin"
              ? "bg-purple-100"
              : "bg-green-100"
          }`}
        >
          <Text
            className={`text-xs font-bold ${
              item.role === "Admin"
                ? "text-purple-600"
                : "text-green-600"
            }`}
          >
            {item.role}
          </Text>
        </View>
      </View>

      {/* Phone */}
      <View className="mt-3 flex-row items-center gap-2">
        <Ionicons name="call-outline" size={14} color="gray" />
        <Text className="text-gray-500 text-xs">
          {item.displayPhone}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-black p-4">

      {/* Search */}
      <View className="flex-row items-center bg-white dark:bg-[#1a1a1a] px-3 py-2 rounded-xl mb-4 border border-gray-200 dark:border-white/10">
        <Ionicons name="search" size={18} color="gray" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search users..."
          placeholderTextColor="gray"
          className="ml-2 flex-1 text-black dark:text-white"
        />
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={UserCard}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}