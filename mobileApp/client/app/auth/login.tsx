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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "@/config/app";
import { 
  MaterialCommunityIcons, 
  Ionicons, 
  AntDesign, 
  SimpleLineIcons 
} from "@expo/vector-icons";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

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

      await AsyncStorage.setItem("authToken", data.token);
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
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
          
          {/* Header Section */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={32} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.langSelector}>
              <Text style={styles.langText}>භාෂාව</Text>
              <MaterialCommunityIcons name="chevron-down" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>please provide details below to login</Text>

            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="email-outline" size={24} color="black" style={styles.inputIcon} />
              <TextInput
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <SimpleLineIcons name="lock" size={22} color="black" style={styles.inputIcon} />
              <TextInput
                placeholder="Enter your password"
                secureTextEntry={secureText}
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                <Ionicons 
                  name={secureText ? "eye-off-outline" : "eye-outline"} 
                  size={24} 
                  color="rgba(0,0,0,0.5)" 
                />
              </TouchableOpacity>
            </View>

            {/* Options Row */}
            <View style={styles.optionsRow}>
              <TouchableOpacity 
                style={styles.rememberMe} 
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxActive]} />
                <Text style={styles.optionText}>Remember Me</Text>
              </TouchableOpacity>
              
              <TouchableOpacity>
                <Text style={styles.optionText}>Forget your password?</Text>
              </TouchableOpacity>
            </View>

            {/* Log In Button (FIXED) */}
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
              <View style={styles.googleIconCircle}>
                <AntDesign name="google" size={24} color="#4285F4" />
              </View>
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E7",
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 30, 
  },
  backBtn: {
    width: 50,
    height: 50,
    justifyContent: "center",
  },
  langSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingRight: 10,
  },
  langText: {
    fontFamily: "Poppins",
    fontSize: 16,
    color: "#000",
    marginRight: 4,
    fontWeight: "800",
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: "center",
    paddingTop: 20,
  },
  title: {
    fontFamily: "Poppins",
    fontSize: 34,
    fontWeight: "700",
    color: "#000",
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: "Poppins",
    fontSize: 16,
    lineHeight: 24, 
    color: "rgba(0,0,0,0.62)",
    marginBottom: 40,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 58,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: "Poppins",
    fontSize: 16,
    color: "#000",
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 35,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#000",
    marginRight: 8,
  },
  checkboxActive: {
    backgroundColor: "#000",
  },
  optionText: {
    fontFamily: "Poppins",
    fontSize: 16, 
    color: "#000",
  },
  loginButton: {
    width: "100%",
    height: 60,
    backgroundColor: "#FF9F1C",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    fontFamily: "Poppins",
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    width: "100%",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#000",
  },
  dividerText: {
    fontFamily: "Poppins",
    marginHorizontal: 10,
    fontSize: 15,
    color: "#000",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 220,
    height: 65,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 12,
    backgroundColor: "#FFF",
  },
  googleIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EEE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  googleText: {
    fontFamily: "Poppins",
    fontSize: 24,
    color: "#000",
  },
  footer: {
    marginTop: 60,
    marginBottom: 30,
  },
  footerText: {
    fontFamily: "Poppins",
    fontSize: 16,
    color: "#000",
  },
});