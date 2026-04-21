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
import { 
  MaterialCommunityIcons, 
  Ionicons, 
  AntDesign, 
  SimpleLineIcons 
} from "@expo/vector-icons";
import API_BASE_URL from "@/config/app";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nic, setNic] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [secureText, setSecureText] = useState(true);
  const [secureConfirmText, setSecureConfirmText] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const register = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill required fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    if (!agreed) {
      Alert.alert("Error", "You must agree to the Terms and Conditions.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          phoneNumber,
          NIC: nic,
          // Sending empty strings for these as they are not in the current UI design
          adminID: "",
          userCategory: "",
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
      Alert.alert("Error", "Cannot connect to server.");
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
        <ScrollView contentContainerStyle={styles.scrollContent} bounces={false} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
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
            <Text style={styles.title}>SignUp</Text>

            {/* Full Name */}
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={22} color="black" style={styles.inputIcon} />
              <TextInput
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholderTextColor="#999"
              />
            </View>

            {/* Email */}
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="email-outline" size={24} color="black" style={styles.inputIcon} />
              <TextInput
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                placeholderTextColor="#999"
              />
            </View>

            {/* Phone Number */}
            <View style={styles.inputWrapper}>
              <Ionicons name="phone-portrait-outline" size={22} color="black" style={styles.inputIcon} />
              <TextInput
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                style={styles.input}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
              />
            </View>

            {/* NIC */}
            <View style={styles.inputWrapper}>
              <AntDesign name="idcard" size={24} color="black" style={styles.inputIcon} />
              <TextInput
                placeholder="Enter your NIC"
                value={nic}
                onChangeText={setNic}
                style={styles.input}
                placeholderTextColor="#999"
              />
            </View>

            {/* Password */}
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

            {/* Confirm Password */}
            <View style={styles.inputWrapper}>
              <SimpleLineIcons name="lock" size={22} color="black" style={styles.inputIcon} />
              <TextInput
                placeholder="Confirm your password"
                secureTextEntry={secureConfirmText}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={() => setSecureConfirmText(!secureConfirmText)}>
                <Ionicons 
                  name={secureConfirmText ? "eye-off-outline" : "eye-outline"} 
                  size={24} 
                  color="rgba(0,0,0,0.5)" 
                />
              </TouchableOpacity>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[styles.signUpButton, loading && { opacity: 0.7 }]}
              onPress={register}
              disabled={loading}
            >
              <Text style={styles.signUpButtonText}>
                {loading ? "Creating..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            {/* Terms and Conditions */}
            <TouchableOpacity 
              style={styles.termsRow} 
              onPress={() => setAgreed(!agreed)}
            >
              <View style={[styles.checkbox, agreed && styles.checkboxActive]} />
              <Text style={styles.termsText}>
                I Agree with the Term and Conditions and Privacy Policy of AliProject.
              </Text>
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 40,
  },
  title: {
    fontFamily: "Poppins",
    fontSize: 34,
    fontWeight: "700",
    color: "#000",
    marginBottom: 35,
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
  signUpButton: {
    width: "100%",
    height: 60,
    backgroundColor: "#FF9F1C",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  signUpButtonText: {
    fontFamily: "Poppins",
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    paddingRight: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#000",
    marginRight: 12,
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: "#000",
  },
  termsText: {
    fontFamily: "Poppins",
    fontSize: 14,
    color: "rgba(0,0,0,0.7)",
    lineHeight: 20,
    flex: 1,
  },
});