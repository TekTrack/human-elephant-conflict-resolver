import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "@/config/app";

export const fetchZonesData = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const res = await axios.get(`${API_BASE_URL}/api/admin/zones`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // ✅ Guard: only save if we actually got a valid array back
    if (!Array.isArray(res.data)) {
      throw new Error("Invalid zones response from server");
    }

    await AsyncStorage.setItem("savedZones", JSON.stringify(res.data));
    return res.data;
  } catch (error) {
    // If the fetch fails, fall back to whatever is already on disk
    // rather than returning [] which would trigger "Outside Safe Zones"
    const existing = await AsyncStorage.getItem("savedZones");
    return existing ? JSON.parse(existing) : [];
  }
};
