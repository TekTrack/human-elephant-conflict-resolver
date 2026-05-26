// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   SafeAreaView,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";

// import { router } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import API_BASE_URL from "@/config/app";

// export default function RegisterScreen() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [nic, setNic] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [secureText, setSecureText] = useState(true);
//   const [secureConfirmText, setSecureConfirmText] = useState(true);
//   const [agreed, setAgreed] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const register = async () => {
//     if (!name || !email || !password || !confirmPassword) {
//       Alert.alert("Error", "Please fill required fields.");
//       return;
//     }
//     if (password !== confirmPassword) {
//       Alert.alert("Error", "Passwords do not match.");
//       return;
//     }
//     if (!agreed) {
//       Alert.alert("Error", "Accept Terms & Conditions.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await fetch(`${API_BASE_URL}/api/user/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name,
//           email,
//           password,
//           phoneNumber,
//           NIC: nic,
//           adminID: "",
//           userCategory: "",
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         Alert.alert("Register Failed", data.message || "Try again.");
//         return;
//       }

//       Alert.alert("Success", "Account created!");
//       router.replace("/auth/login");
//     } catch (error) {
//       Alert.alert("Error", "Server error.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (


//     <SafeAreaView className="flex-1 bg-[#fcf9f8]">
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         className="flex-1"
//       >
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ flexGrow: 1 }}
//         >


//           <View className="flex-1 px-6 pt-10 pb-6">

//             {/* 🔥 Jumbo Watch Logo */}
//             <View className="items-center mb-8">
//               <View className="w-20 h-20 rounded-full bg-[#1b4332] items-center justify-center shadow-lg">
//                 <Ionicons name="leaf" size={40} color="white" />
//               </View>
//               <Text className="text-2xl font-bold text-[#012d1d] mt-3">
//                 Jumbo Watch
//               </Text>
//             </View>

//             {/* Title */}
//             <Text className="text-3xl font-bold text-[#012d1d] mb-2">
//               Sign Up
//             </Text>
//             <Text className="text-gray-500 mb-6">
//               Create your account to continue
//             </Text>

//             {/* Inputs */}

//             {/* Name */}
//             <View className="flex-row items-center border border-gray-300 rounded-xl px-4 h-14 mb-4 bg-white">
//               <Ionicons name="person-outline" size={20} color="gray" />
//               <TextInput
//                 placeholder="Full Name"
//                 className="flex-1 ml-3 text-base"
//                 value={name}
//                 onChangeText={setName}
//               />
//             </View>

//             {/* Email */}
//             <View className="flex-row items-center border border-gray-300 rounded-xl px-4 h-14 mb-4 bg-white">
//               <Ionicons name="mail-outline" size={20} color="gray" />
//               <TextInput
//                 placeholder="Email"
//                 className="flex-1 ml-3 text-base"
//                 value={email}
//                 onChangeText={setEmail}
//               />
//             </View>

//             {/* Phone */}
//             <View className="flex-row items-center border border-gray-300 rounded-xl px-4 h-14 mb-4 bg-white">
//               <Ionicons name="call-outline" size={20} color="gray" />
//               <TextInput
//                 placeholder="Phone Number"
//                 className="flex-1 ml-3 text-base"
//                 value={phoneNumber}
//                 onChangeText={setPhoneNumber}
//               />
//             </View>

//             {/* NIC */}
//             <View className="flex-row items-center border border-gray-300 rounded-xl px-4 h-14 mb-4 bg-white">
//               <Ionicons name="card-outline" size={20} color="gray" />
//               <TextInput
//                 placeholder="NIC"
//                 className="flex-1 ml-3 text-base"
//                 value={nic}
//                 onChangeText={setNic}
//               />
//             </View>

//             {/* Password */}
//             <View className="flex-row items-center border border-gray-300 rounded-xl px-4 h-14 mb-4 bg-white">
//               <Ionicons name="lock-closed-outline" size={20} color="gray" />
//               <TextInput
//                 placeholder="Password"
//                 secureTextEntry={secureText}
//                 className="flex-1 ml-3 text-base"
//                 value={password}
//                 onChangeText={setPassword}
//               />
//               <TouchableOpacity onPress={() => setSecureText(!secureText)}>
//                 <Ionicons
//                   name={secureText ? "eye-off-outline" : "eye-outline"}
//                   size={20}
//                   color="gray"
//                 />
//               </TouchableOpacity>
//             </View>

//             {/* Confirm Password */}
//             <View className="flex-row items-center border border-gray-300 rounded-xl px-4 h-14 mb-4 bg-white">
//               <Ionicons name="lock-closed-outline" size={20} color="gray" />
//               <TextInput
//                 placeholder="Confirm Password"
//                 secureTextEntry={secureConfirmText}
//                 className="flex-1 ml-3 text-base"
//                 value={confirmPassword}
//                 onChangeText={setConfirmPassword}
//               />
//               <TouchableOpacity
//                 onPress={() => setSecureConfirmText(!secureConfirmText)}
//               >
//                 <Ionicons
//                   name={secureConfirmText ? "eye-off-outline" : "eye-outline"}
//                   size={20}
//                   color="gray"
//                 />
//               </TouchableOpacity>
//             </View>

//             {/* Terms */}
//             <TouchableOpacity
//               className="flex-row items-center mb-6"
//               onPress={() => setAgreed(!agreed)}
//             >
//               <View
//                 className={`w-5 h-5 rounded border mr-3 ${
//                   agreed ? "bg-black" : "border-gray-400"
//                 }`}
//               />
//               <Text className="text-sm text-gray-600 flex-1">
//                 I agree to Terms & Conditions
//               </Text>
//             </TouchableOpacity>

//             {/* Button */}
//             <TouchableOpacity
//               className="h-14 bg-[#012d1d] rounded-xl items-center justify-center"
//               onPress={register}
//               disabled={loading}
//             >
//               <Text className="text-white text-lg font-semibold">
//                 {loading ? "Creating..." : "Sign Up"}
//               </Text>
//             </TouchableOpacity>

//             {/* Footer */}
//             <TouchableOpacity
//               onPress={() => router.push("/auth/login")}
//               className="mt-6 items-center"
//             >
//               <Text className="text-gray-500">
//                 Already have an account?{" "}
//                 <Text className="text-[#012d1d] font-semibold">
//                   Login
//                 </Text>
//               </Text>
//             </TouchableOpacity>

//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }


import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker"; 
import API_BASE_URL from "@/config/app";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nic, setNic] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 🏛️ Zone States
  const [zones, setZones] = useState<{ id: number; name: string }[]>([]); // Stores data fetched from image_b29d1f.png structure
  const [selectedZoneId, setSelectedZoneId] = useState(""); // Tracks the foreign key value

  const [secureText, setSecureText] = useState(true);
  const [secureConfirmText, setSecureConfirmText] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔄 Fetch Zones on Screen Load
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/zones`); // Make sure this matches your exact backend endpoint route
        const data = await res.json();
        if (res.ok) {
          // Filter out rows where name is empty or null (e.g. Row 23 in image_b29d1f.png)
          const validZones = data.filter(z => z.name && z.name !== "EMPTY");
          setZones(validZones);
        }
      } catch (error) {
        console.error("Failed to load zones:", error);
      }
    };

    fetchZones();
  }, []);

  const register = async () => {
    if (!name || !email || !password || !confirmPassword || !selectedZoneId) {
      Alert.alert("Error", "Please fill required fields, including your Zone.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    if (!agreed) {
      Alert.alert("Error", "Accept Terms & Conditions.");
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
          adminID: "",
          userCategory: "Civil", // Auto-filling this since users default here
          zoneId: parseInt(selectedZoneId), // 👈 Appending the zone foreign key here
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Register Failed", data.message || "Try again.");
        return;
      }

      Alert.alert("Success", "Account created!");
      router.replace("/auth/login");
    } catch (error) {
      Alert.alert("Error", "Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fcf9f8]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="flex-1 px-6 pt-10 pb-6">

            {/* 🔥 Jumbo Watch Logo */}
            <View className="items-center mb-8">
              <View className="w-20 h-20 rounded-full bg-[#1b4332] items-center justify-center shadow-lg">
                <Ionicons name="leaf" size={40} color="white" />
              </View>
              <Text className="text-2xl font-bold text-[#012d1d] mt-3">
                Jumbo Watch
              </Text>
            </View>

            {/* Title */}
            <Text className="text-3xl font-bold text-[#012d1d] mb-2">
              Sign Up
            </Text>
            <Text className="text-gray-500 mb-6">
              Create your account to continue
            </Text>

            {/* Inputs */}

            {/* Name */}
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 h-14 mb-4 bg-white">
              <Ionicons name="person-outline" size={20} color="gray" />
              <TextInput
                placeholder="Full Name"
                className="flex-1 ml-3 text-base"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Email */}
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 h-14 mb-4 bg-white">
              <Ionicons name="mail-outline" size={20} color="gray" />
              <TextInput
                placeholder="Email"
                className="flex-1 ml-3 text-base"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Phone */}
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 h-14 mb-4 bg-white">
              <Ionicons name="call-outline" size={20} color="gray" />
              <TextInput
                placeholder="Phone Number"
                className="flex-1 ml-3 text-base"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>

            {/* NIC */}
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 h-14 mb-4 bg-white">
              <Ionicons name="card-outline" size={20} color="gray" />
              <TextInput
                placeholder="NIC"
                className="flex-1 ml-3 text-base"
                value={nic}
                onChangeText={setNic}
              />
            </View>

            {/* 📍 Zone Dropdown Picker Component */}
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 h-14 mb-4 bg-white overflow-hidden">
              <Ionicons name="location-outline" size={20} color="gray" />
              <View className="flex-1 ml-1">
                <Picker
                  selectedValue={selectedZoneId}
                  onValueChange={(itemValue) => setSelectedZoneId(itemValue)}
                  dropdownIconColor="gray"
                  mode="dropdown"
                  style={{ backgroundColor: 'transparent', marginHorizontal: -10 }}
                >
                  <Picker.Item label="Select your Zone" value="" color="gray" />
                  {zones.map((zone) => (
                    <Picker.Item 
                      key={zone.id.toString()} 
                      label={zone.name} 
                      value={zone.id.toString()} 
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Password */}
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 h-14 mb-4 bg-white">
              <Ionicons name="lock-closed-outline" size={20} color="gray" />
              <TextInput
                placeholder="Password"
                secureTextEntry={secureText}
                className="flex-1 ml-3 text-base"
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                <Ionicons
                  name={secureText ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 h-14 mb-4 bg-white">
              <Ionicons name="lock-closed-outline" size={20} color="gray" />
              <TextInput
                placeholder="Confirm Password"
                secureTextEntry={secureConfirmText}
                className="flex-1 ml-3 text-base"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setSecureConfirmText(!secureConfirmText)}
              >
                <Ionicons
                  name={secureConfirmText ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>

            {/* Terms */}
            <TouchableOpacity
              className="flex-row items-center mb-6"
              onPress={() => setAgreed(!agreed)}
            >
              <View
                className={`w-5 h-5 rounded border mr-3 ${
                  agreed ? "bg-black" : "border-gray-400"
                }`}
              />
              <Text className="text-sm text-gray-600 flex-1">
                I agree to Terms & Conditions
              </Text>
            </TouchableOpacity>

            {/* Button */}
            <TouchableOpacity
              className="h-14 bg-[#012d1d] rounded-xl items-center justify-center"
              onPress={register}
              disabled={loading}
            >
              <Text className="text-white text-lg font-semibold">
                {loading ? "Creating..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            {/* Footer */}
            <TouchableOpacity
              onPress={() => router.push("/auth/login")}
              className="mt-6 items-center"
            >
              <Text className="text-gray-500">
                Already have an account?{" "}
                <Text className="text-[#012d1d] font-semibold">
                  Login
                </Text>
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}