import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nic, setNic] = useState("");
  const [password, setPassword] = useState("");
  const [adminID, setAdminID] = useState("");
  const [userCategory, setUserCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill required fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://10.17.66.70:8080/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phoneNumber,
          NIC: nic,
          adminID,
          userCategory,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Register Failed", data.message || "Try again.");
        return;
      }

      Alert.alert("Success", "Account created successfully!");

      router.replace("/auth/login");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.glow} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Register</Text>

        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          style={styles.input}
          keyboardType="phone-pad"
        />

        <TextInput
          placeholder="NIC"
          value={nic}
          onChangeText={setNic}
          style={styles.input}
        />

        <TextInput
          placeholder="Admin ID"
          value={adminID}
          onChangeText={setAdminID}
          style={styles.input}
        />

        <TextInput
          placeholder="User Category"
          value={userCategory}
          onChangeText={setUserCategory}
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
          onPress={register}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Creating..." : "Register"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/auth/login")}
          style={{ marginTop: 15 }}
        >
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  glow: {
    position: "absolute",
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: "#0FFF50",
    opacity: 0.4,
    top: "20%",
    left: "20%",
    transform: [{ scale: 2 }],
  },

  content: {
    padding: 25,
    paddingTop: 70,
    paddingBottom: 60,
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
    marginTop: 10,
  },

  buttonText: {
    color: "black",
    fontWeight: "bold",
  },

  link: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    opacity: 0.8,
  },
});