import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "@/config/app";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);

  const login = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
        return;
      }

      console.log("token",data.token);

      await AsyncStorage.setItem("authToken", data.token);
      await AsyncStorage.setItem("email", data.data.email);
      router.replace("/admin/overview");
    } catch (error) {
      Alert.alert("Error", "Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header with Language Selector */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn}>
          <Text style={styles.iconText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.langSelector}>
          <Text style={styles.langText}>භාෂාව ⌄</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>please provide details below to login</Text>

        {/* Email Input */}
        <View style={styles.inputWrapper}>
           
          <TextInput
            placeholder="Enter email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            placeholderTextColor="#999"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputWrapper}>
           
          <TextInput
            placeholder="Enter your password"
            secureTextEntry={secureText}
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholderTextColor="#999"
          />
          <TouchableOpacity onPress={() => setSecureText(!secureText)}>
            <Text style={styles.eyeIcon}>{secureText ? "👁️" : "👁️‍🗨️"}</Text>
          </TouchableOpacity>
        </View>

        {/* Options Row */}
        <View style={styles.optionsRow}>
          <TouchableOpacity style={styles.rememberMe}>
            <View style={styles.checkbox} />
            <Text style={styles.optionText}>Remember Me</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.optionText}>Forget your password?</Text>
          </TouchableOpacity>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.loginButton, loading && { opacity: 0.7 }]}
          onPress={login}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? "Logging in..." : "Log In"}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>or Countinue With</Text>
          <View style={styles.line} />
        </View>

        {/* Google Login */}
        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleIcon}>G</Text>
          <Text style={styles.googleText}>Google</Text>
        </TouchableOpacity>

        {/* Footer */}
        <TouchableOpacity 
            onPress={() => router.push("/auth/register")} 
            style={styles.footer}
        >
          <Text style={styles.footerText}>Don’t have a account?</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 20,
    marginTop: 10,
  },
  backBtn: { padding: 10 },
  iconText: { fontSize: 24, color: "#000" },
  langSelector: { padding: 10 },
  langText: { fontSize: 16, color: "#000" },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(0,0,0,0.6)",
    marginBottom: 40,
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
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  inputIcon: { fontSize: 18, marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: "#000" },
  eyeIcon: { fontSize: 18 },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 35,
  },
  rememberMe: { flexDirection: "row", alignItems: "center" },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 8,
  },
  optionText: { fontSize: 14, color: "#000" },
  loginButton: {
    width: "100%",
    height: 55,
    backgroundColor: "#FF9F1C",
    borderRadius: 20,
    //borderWidth: 2,
    //borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: { flex: 1, height: 1, backgroundColor: "#000" },
  dividerText: { marginHorizontal: 10, fontSize: 14, color: "#000" },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 60,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    borderRadius: 10,
    backgroundColor: "#FFF",
  },
  googleIcon: { fontSize: 24, fontWeight: "bold", color: "#4285F4" },
  googleText: { fontSize: 24, marginLeft: 10, color: "#000" },
  footer: { marginTop: "auto", marginBottom: 30 },
  footerText: { fontSize: 16, color: "#000" },
});