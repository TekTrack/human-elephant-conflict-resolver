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
import API_BASE_URL from "@/config/app";

export default function ForgotPasswordScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      Alert.alert("error", "Please enter a valid phone number.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/sms/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("error", data.message || "Failed to send OTP.");
        return;
      }

      Alert.alert("success", "OTP sent successfully. Please check your phone.");
      
      
      router.push({
        pathname: "/auth/verify-otp",
        params: { phone: phoneNumber }
      });

    } catch (error) {
      Alert.alert("error", "cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.iconText}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>OTP Login</Text>
        <Text style={styles.subtitle}>
          Please enter your phone number to receive an OTP for login. (e.g., 07X XXX XXXX)
        </Text>

        {/* Phone Number Input */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputIcon}>📞</Text>
          <TextInput
            placeholder="07X XXX XXXX"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.input}
            keyboardType="phone-pad"
            placeholderTextColor="#999"
            maxLength={10}
          />
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.actionButton, loading && { opacity: 0.7 }]}
          onPress={sendOTP}
          disabled={loading}
        >
          <Text style={styles.actionButtonText}>
            {loading ? "Sending OTP..." : "Get OTP Code"}
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.footer}
        >
          <Text style={styles.footerText}>again <Text style={{fontWeight: 'bold'}}>Login</Text> to the app</Text>
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
    paddingHorizontal: 20,
    marginTop: 10,
  },
  backBtn: { padding: 10 },
  iconText: { fontSize: 24, color: "#000" },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(0,0,0,0.6)",
    marginBottom: 40,
    textAlign: "center",
    lineHeight: 22,
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
    marginBottom: 30,
    backgroundColor: "transparent",
  },
  inputIcon: { fontSize: 18, marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: "#000" },
  actionButton: {
    width: "100%",
    height: 55,
    backgroundColor: "#FF9F1C",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  footer: { marginTop: "auto", marginBottom: 30 },
  footerText: { fontSize: 16, color: "#000" },
});