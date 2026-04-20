import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
 

export default function LoginScreen() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

 const login = async () => {
  try {
    setLoading(true);

    const res = await fetch("http://10.17.66.70:8080/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      Alert.alert("Login Failed", data.message || "Invalid credentials");
      return;
    }

    await AsyncStorage.setItem("authToken", data.token);

    // direct login success
    router.replace("/admin/overview");

  } catch (error) {
    Alert.alert("Error", "Cannot connect to server");
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
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
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

        <TouchableOpacity onPress={() => router.push("/auth/register")}
          style={{ marginTop: 15 }}
        >
          <Text style={{ textAlign: "center", color: "white", fontWeight: "bold",opacity: 0.8 }}>
            {`Don't have an account? Register`}
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },

  glow: {
    position: "absolute",
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: "#0FFF50",
    opacity: 0.4,
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
    color: "#ffffff",
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
    backgroundColor: "#0FFF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "black",
    fontWeight: "bold",
  },
});