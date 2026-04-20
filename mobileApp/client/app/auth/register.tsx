import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
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
  const [secureText, setSecureText] = useState(true);
  const [agreed, setAgreed] = useState(false);

  const register = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill required fields.");
      return;
    }
    if (!agreed) {
      Alert.alert("Error", "You must agree to the Terms and Conditions.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://10.255.223.22:8080/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      Alert.alert("Error", "Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.iconText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.langSelector}>
          <Text style={styles.langText}>භාෂාව ⌄</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>SignUp</Text>

        {/* Input Fields */}
        {[
          { icon: "👤", placeholder: "Full Name", val: name, set: setName },
          { icon: "✉", placeholder: "Enter your email", val: email, set: setEmail, type: "email-address" },
          { icon: "📱", placeholder: "Enter your phone number", val: phoneNumber, set: setPhoneNumber, type: "phone-pad" },
          { icon: "🪪", placeholder: "Enter your NIC", val: nic, set: setNic },
          { icon: "🔑", placeholder: "Admin ID", val: adminID, set: setAdminID },
          { icon: "📁", placeholder: "User Category", val: userCategory, set: setUserCategory },
        ].map((item, index) => (
          <View key={index} style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>{item.icon}</Text>
            <TextInput
              placeholder={item.placeholder}
              value={item.val}
              onChangeText={item.set}
              style={styles.input}
              keyboardType={item.type || "default"}
              placeholderTextColor="#999"
            />
          </View>
        ))}

        {/* Password Field */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputIcon}>🔒</Text>
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

        {/* Action Button */}
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
          <View style={[styles.checkbox, agreed && styles.checked]} />
          <Text style={styles.termsText}>
            I Agree with the Term and Conditions and Privacy Policy of AliProject.
          </Text>
        </TouchableOpacity>

        {/* Footer Link */}
        <TouchableOpacity 
            onPress={() => router.replace("/auth/login")} 
            style={styles.footer}
        >
          <Text style={styles.footerText}>Already have an account? Login</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    marginTop: 10,
  },
  backBtn: { padding: 10 },
  iconText: { fontSize: 24, color: "#000" },
  langSelector: { padding: 10 },
  langText: { fontSize: 16, color: "#000" },
  scrollContent: {
    paddingHorizontal: 24,
    alignItems: "center",
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginVertical: 20,
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
    marginBottom: 15,
    backgroundColor: "transparent",
  },
  inputIcon: { fontSize: 18, marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: "#000" },
  eyeIcon: { fontSize: 18 },
  signUpButton: {
    width: "100%",
    height: 55,
    backgroundColor: "#FF9F1C",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    paddingRight: 20,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 10,
    marginTop: 2,
  },
  checked: {
    backgroundColor: "#FF9F1C",
  },
  termsText: {
    fontSize: 13,
    color: "#000",
    lineHeight: 18,
    flex: 1,
  },
  footer: { marginTop: 30 },
  footerText: { fontSize: 16, color: "#000", fontWeight: "600" },
});