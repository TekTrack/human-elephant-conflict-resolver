import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const CARDS = [
  {
    title: "View Elephant Alerts",
    icon: "notifications" as const,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAUKStuPmxt9rLdjiU98OWvNawY75d7SX9jXQ09_Z4gYabuotaXWjrZcShq7rNPQuBy7JuYfk1-zQn3cgoIBhRLU0MhVDJbqE9_IUSJ_ruR2Db4yVIREw4qT-E8P3lAsmujQzlAzO1B89o8QrvU_s2JfdyU-mijPsC12lnusYQcN8vNWDgQblaMEohjyA0H6eOxPim_tYQtyI4ZUgHrBRV89Iu5Q2z2RXpwMcFzahsLKRKveQCTv6Myq0L8nIK_KsZO7FMN9GPJfY5g",
    desc: "Stay informed with real-time alerts about elephant sightings near you.",
    tag: "Real-time updates",
    steps: [
      "Open the Alerts tab from the bottom navigation.",
      "Enable push notifications when prompted.",
      "Tap any alert to see the exact sighting location on the map.",
      "Use filters to narrow alerts by distance or time.",
    ],
    cta: "Go to Alerts",
    // ✅ Update this to match your actual file in app/(tabs)/
    route: "/admin/sighting-alerts",
  },
  {
    title: "Use Live Map Tracking",
    icon: "map" as const,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBIctDJq0OrHIv7u1MMLcSihH1UONQnj7qu7dHfjdpNEEJhAxoMKpSwve5u1Mw_ILGo1GnvxWOLhq3rZUZ2eT-UGXGHOBE6L4jsgC0EVDdLGC50xHi_gDfjrG_nkGjUtB_TOKayQWNy__27pGeEvt7fujgaTIYYpSbBNB1hACVC80VrOZcTs6_711F-9qg7MYf6sEUtY8C4g23QAI-I8TknbdeERj2L-LQ8hPYMOYZMd1s9kzbNR5T5nixwfq4UJUrh7jQXRmH8vQO4",
    desc: "Monitor movement and safe zones using the live map system.",
    tag: "Live data",
    steps: [
      "Tap the Map tab to open the live tracking view.",
      "Green zones are currently safe — avoid red zones.",
      "Pinch to zoom into your local area for detail.",
      "Tap an elephant icon to view its last seen time and direction.",
    ],
    cta: "Open Map",
    // ✅ Update this to match your actual file in app/(tabs)/
    route: "/admin/geofencing",
  },
  {
    title: "Report Sightings",
    icon: "add-location" as const,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCuyTJsJCc1DZLyKVU3z5Msvn-q3bSvL96vxklvhY6E9kv4jenL77sGQjFkHW8kOhSVFN2TdZr_OqXoLBBbrtHbPgbp960-hPgtvXN5XZ0ett_JEHWxwmkZwJyduDC3hemgUC4x4X7YaqKe8MuuU0Ssoc_77FCXx5DI2c7MjIZIL-CF8YtNg4eM99DjkRyvPM118OGH_rhmEnCldLLPpOljXSIxjBMEqMOYaEvp0G65O_08Eu3jsAx3KoZyyPWOkUqP_yuie3dNCl0x",
    desc: "Help others by reporting elephant sightings quickly.",
    tag: "Community report",
    steps: [
      "Tap the '+' button on the home screen.",
      "Allow location access so your report is pinned correctly.",
      "Optionally add a photo for better context.",
      "Submit — rangers and nearby users are notified instantly.",
    ],
    cta: "Report a Sighting",
    // ✅ Update this to match your actual file in app/(tabs)/
    route: "/admin/upload-image",
  },
  {
    title: "Manage Your Profile",
    icon: "person" as const,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA-C2wYgguP20vFlHZHF8lNkX5Mx-kHG44tm3M1avCTUzJL8tPq4UUDfBg2Dg1sqjK6AdMo_BH1rkKndsp8RNbDbcKPG_9CSm-apuuAmUjVbt3SXotwYR5xH9oaIdCN1B6VkKATNQyaDuviVbrnuc1Ee1AAV7U9R-_vE2F_qaqsHcm3MnQcCG2xm7PSW-UluZ5CymuWPqYLTldrosnGAv4QMjGL1Nk0QoJUHOoGo7T-FrLo3w0UTknNvkMDiQq--Of6gsvVBMOfX3XR",
    desc: "Update your preferences and manage your account.",
    tag: "Account settings",
    steps: [
      "Tap your avatar in the top-right corner.",
      "Edit your name, location region, and notification radius.",
      "Toggle alert types — sound, vibration, or silent.",
      "View your reported sightings and contribution history.",
    ],
    cta: "Open Profile",
    // ✅ Update this to match your actual file in app/(tabs)/
    route: "/admin/my-profile",
  },
];

type CardItemProps = {
  item: (typeof CARDS)[number];
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: (route: string) => void;
};

function CardItem({ item, isOpen, onToggle, onNavigate }: CardItemProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handleToggle = () => {
    Animated.timing(rotateAnim, {
      toValue: isOpen ? 0 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View className="mt-4 bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Card Header — tap to expand/collapse */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleToggle}
        className="flex-row items-center p-4 gap-3"
      >
        <Image
          source={{ uri: item.image }}
          className="w-14 h-14 rounded-lg"
          resizeMode="cover"
        />

        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Ionicons name={item.icon} size={18} color="#77574d" />
            <Text className="text-base font-semibold text-[#012d1d]">
              {item.title}
            </Text>
          </View>
          <Text className="text-gray-500 text-sm leading-5">{item.desc}</Text>
        </View>

        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons name="chevron-down" size={20} color="#9ca3af" />
        </Animated.View>
      </TouchableOpacity>

      {/* Expandable Detail Panel */}
      {isOpen && (
        <View className="border-t border-gray-100">
          {/* Large image */}
          <Image
            source={{ uri: item.image }}
            className="w-full h-40"
            resizeMode="cover"
          />

          <View className="p-4">
            {/* Tag badge */}
            <View className="self-start flex-row items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full mb-3">
              <Ionicons name="checkmark-circle" size={13} color="#065f46" />
              <Text className="text-xs font-medium text-emerald-800">
                {item.tag}
              </Text>
            </View>

            {/* Steps */}
            {item.steps.map((step, si) => (
              <View key={si} className="flex-row items-start gap-3 mb-3">
                <View className="w-6 h-6 rounded-full bg-[#012d1d] items-center justify-center mt-0.5">
                  <Text className="text-white text-xs font-semibold">
                    {si + 1}
                  </Text>
                </View>
                <Text className="flex-1 text-sm text-gray-700 leading-5">
                  {step}
                </Text>
              </View>
            ))}

            {/* ✅ CTA button — navigates to the linked screen */}
            <TouchableOpacity
              onPress={() => onNavigate(item.route)}
              className="mt-2 bg-[#012d1d] py-3 rounded-full items-center flex-row justify-center gap-2"
            >
              <Ionicons name={item.icon} size={16} color="white" />
              <Text className="text-white font-semibold text-sm">
                {item.cta}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

export default function GuideScreen() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const router = useRouter();

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const handleNavigate = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fcf9f8]">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 h-16 border-b border-gray-200 bg-white">
        <View className="flex-row items-center gap-2">
          <Ionicons name="leaf" size={24} color="#065f46" />
          <Text className="text-lg font-bold text-emerald-900">
            Jumbo Watch
          </Text>
        </View>

        {/* ✅ Avatar taps to profile */}
        <TouchableOpacity onPress={() => handleNavigate("/(tabs)/profile")}>
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFZJdmp88bbPdDhX4D_Bqp1DCegtmjNx0c4rYfvbR3bEQgf60ba4WnzbHLgS3HWhXaAIQIvU-kpznwXUSTcaOgOdBy2mLEmoj9tJMHEtmI8ZZBV2KzERWaOIoC1qz3dlUozjv36Em4mWr_HoJV2PSEgT-1zzxPY1jl0thTv8kLMmdzjiqs53LbgXR8TRIP2QLIp6KYkXMH_MPFbNTjRWD4ur77JvofWXkw4f8isXKvK27u_2j-a2CBUTruWxR-CqpTu7mTCZUKjrDZ",
            }}
            className="w-10 h-10 rounded-full border-2 border-emerald-800"
          />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-4">
        {/* Title */}
        <View className="mt-4">
          <View className="flex-row items-center gap-2 mb-1">
            <MaterialIcons name="menu-book" size={22} color="#721e00" />
            <Text className="text-2xl font-bold text-[#012d1d]">
              Jumbo Watch Guide
            </Text>
          </View>
          <Text className="text-gray-600">
            Learn how to use the system effectively for community safety and
            wildlife protection.
          </Text>
        </View>

        {/* Hero */}
        <View className="mt-6 rounded-xl overflow-hidden">
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuALDnujfvoPvp1SQOGy_9Zz86xXV9wnagsiIYVBkJ2SNa8r-Uss1NRg0LSlsDDwYegcS2c__eNWlkZYcXxLFWKh0_g3sRI8ipfXDbuWssAcu3fQGrBzTrUy4H2sOP7EMXliMOvNIUm5nvl-GlJqu21HuenN_IhFR3rCvCgSAGXrD_pNziSKUAleQbDnFCxBjUqCEjuhWBIwszfq6xCi3bmSeXjUQdgU-BiRwE_BdII3huWdFQekXTLmAtHW8I46QIlXYbzFJO7M7Gqp",
            }}
            className="w-full h-56"
          />
          <View className="absolute bottom-0 w-full p-4 bg-black/50">
            <Text className="text-white text-lg font-bold">
              Protecting Communities & Giants
            </Text>
          </View>
        </View>

        {/* Accordion Cards */}
        {CARDS.map((item, index) => (
          <CardItem
            key={index}
            item={item}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
            onNavigate={handleNavigate}
          />
        ))}

        {/* ✅ Bottom CTA — navigates to alerts screen */}
        <TouchableOpacity
          onPress={() => handleNavigate("/(tabs)/alerts")}
          className="mt-8 mb-20 bg-[#012d1d] py-4 rounded-full items-center"
        >
          <Text className="text-white font-semibold text-lg">
            Ready to Start
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
