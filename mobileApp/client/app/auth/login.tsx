import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
 

export default function LoginScreen() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

 const login = async () => {
  try {
    setLoading(true);

    const res = await fetch("http://10.17.66.70:8080/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    console.log("Login Response:", data);

    if (!res.ok) {
      Alert.alert("Login Failed", data.message || "Invalid Credentials!");
      return;
    }

    console.log("TOKEN:", data.token);

    await AsyncStorage.setItem("authToken", data.token);

    if (data.role?.toLowerCase() === "admin") {
      router.replace("/admin/overview");
    } else {
      Alert.alert("Access Denied", "You are not allowed to access this app");
    }

  } catch (error) {
    console.log("Login error:", error);
    Alert.alert("Error", "Cannot connect to server.");
  } finally {
    setLoading(false);
  }
};
  return (
    <View style={styles.container}>
      
      {/* Background glow */}
      <View style={styles.glow} />

      {/* Login content */}
      <View style={styles.content}>

        <Text style={styles.title}>Login</Text>

        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

         <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={login}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E7",
  },

  glow: {
    position: "absolute",
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: "#FF9F1C",
    opacity: 0.2,
    top: "30%",
    left: "20%",
    transform: [{ scale: 2 }],
  },

  content: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "white",
  },

  button: {
    backgroundColor: "#FF9F1C",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});