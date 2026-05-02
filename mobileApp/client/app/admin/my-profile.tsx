import React, { useState,useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import API_BASE_URL from "@/config/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";





export default function MyProfileScreen() {

  const router = useRouter();


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [adminID, setAdminID] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userCategory, setUserCategory] = useState("");
  const [password, setPassword] = useState("");


  const loadProfile = async () => {
  try {
  
    const token = await AsyncStorage.getItem("authToken");

    const res = await axios.get(
      `${API_BASE_URL}/api/user/getuser`,
      {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
    );

    const user = res.data.data;
    console.log("Fetched user profile:", user); // Debug log

    setName(user.name);
    setEmail(user.email);
    setPhoneNumber(user.phoneNumber);
    setAdminID(user.adminID);
    setUserCategory(user.userCategory);

  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  loadProfile();
}, []);



  const handleUpdate = async () => {
    const token = await AsyncStorage.getItem("authToken");
    try {
      await axios.post(`${API_BASE_URL}/api/user/updateuser`, {
        name,
        email,
        adminID,
        phoneNumber,
        userCategory,
        password,
      },
       {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      }
    );

      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Profile</Text>

          <TouchableOpacity>
            <Ionicons name="person-circle" size={32} color="#000" />
          </TouchableOpacity>
        </View>

        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={45} color="#000" />
          </View>

          <Text style={styles.profileName}>{name || "Your Name"}</Text>
          <Text style={styles.profileSub}>Manage your account details</Text>
        </View>

        {/* FORM */}
        <View style={styles.formContainer}>

          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color="#000" />
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#555"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="#000" />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#555"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="id-card-outline" size={20} color="#000" />
            <TextInput
              placeholder="Admin ID"
              placeholderTextColor="#555"
              style={styles.input}
              value={adminID}
              onChangeText={setAdminID}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="call-outline" size={20} color="#000" />
            <TextInput
              placeholder="Phone Number"
              placeholderTextColor="#555"
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="layers-outline" size={20} color="#000" />
            <TextInput
              placeholder="User Category"
              placeholderTextColor="#555"
              style={styles.input}
              value={userCategory}
              onChangeText={setUserCategory}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#000" />
            <TextInput
              placeholder="New Password"
              placeholderTextColor="#555"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* BUTTON */}
          <TouchableOpacity style={styles.loginButton} onPress={handleUpdate}>
            <Text style={styles.loginButtonText}>Update Profile</Text>
          </TouchableOpacity>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E7",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },

  backBtn: {
    padding: 10,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },

  profileCard: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 25,
  },

  avatar: {
    width: 95,
    height: 95,
    borderRadius: 50,
    backgroundColor: "#FF9F1C",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    elevation: 5,
  },

  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },

  profileSub: {
    fontSize: 14,
    color: "rgba(0,0,0,0.6)",
    marginTop: 5,
  },

  formContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 55,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 18,
    backgroundColor: "#fff",
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    marginLeft: 10,
  },

  loginButton: {
    width: "100%",
    height: 55,
    backgroundColor: "#FF9F1C",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  loginButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});