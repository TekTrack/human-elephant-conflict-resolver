import { Stack } from "expo-router";
import '@/global.css'; // Import Tailwind CSS globally

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}