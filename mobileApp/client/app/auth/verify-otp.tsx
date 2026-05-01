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
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "@/config/app";

export default function VerifyOTPScreen() {
  const { phone } = useLocalSearchParams(); 
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOTP = async () => {
    if (otp.length < 4) {
      Alert.alert("error", "Please enter a valid OTP code.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/user/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("error", data.message || "Input OTP is incorrect.");
        return;
      }

      
      await AsyncStorage.setItem("authToken", data.token);
      router.replace("/admin/overview");

    } catch (error) {
      Alert.alert("error", "Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.iconText}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>
          Please enter the OTP code sent to your phone number <Text style={{fontWeight: 'bold'}}>{phone}</Text>.
        </Text>

        {/* OTP Input */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputIcon}>🔑</Text>
          <TextInput
            placeholder="Enter OTP code"
            value={otp}
            onChangeText={setOtp}
            style={styles.input}
            keyboardType="number-pad"
            placeholderTextColor="#999"
            maxLength={6} 
            textAlign="center"
            letterSpacing={5}
          />
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.verifyButton, loading && { opacity: 0.7 }]}
          onPress={verifyOTP}
          disabled={loading}
        >
          <Text style={styles.verifyButtonText}>
            {loading ? "Verifying..." : "Verify & Login"}
          </Text>
        </TouchableOpacity>

        {/* Resend Option */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          <TouchableOpacity>
            <Text style={styles.resendLink}>Resend Code</Text>
          </TouchableOpacity>
        </View>

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
    height: 60,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 30,
    backgroundColor: "transparent",
  },
  inputIcon: { fontSize: 18, marginRight: 10 },
  input: { 
    flex: 1, 
    fontSize: 22, 
    fontWeight: "bold",
    color: "#000",
  },
  verifyButton: {
    width: "100%",
    height: 55,
    backgroundColor: "#FF9F1C",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  verifyButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  resendText: { fontSize: 14, color: "#000" },
  resendLink: { fontSize: 14, color: "#FF9F1C", fontWeight: "bold" },
});