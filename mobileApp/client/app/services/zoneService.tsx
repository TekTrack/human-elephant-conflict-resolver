// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import API_BASE_URL from "@/config/app";

// export const fetchZonesData = async () => {
//   try {
//     const token = await AsyncStorage.getItem("authToken");
    
//     // 1. Fetch from Spring Boot 🌐
//     const res = await axios.get(`${API_BASE_URL}/api/admin/zones`, {
//       headers: { 
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });
    
//     // 2. Save it offline so the background task can read it! 💾
//     await AsyncStorage.setItem("savedZones", JSON.stringify(res.data));
    
//     return res.data;
    
//   } catch (error) {
//     console.error("Failed to fetch zones:", error);
//     return [];
//   }
// };