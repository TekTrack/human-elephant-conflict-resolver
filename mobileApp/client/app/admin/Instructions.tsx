import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function GuideScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#fcf9f8]">
      
      {/* 🔹 Header */}
      <View className="flex-row justify-between items-center px-4 h-16 border-b border-gray-200 bg-white">
        <View className="flex-row items-center gap-2">
          <Ionicons name="leaf" size={24} color="#065f46" />
          <Text className="text-lg font-bold text-emerald-900">
            Jumbo Watch
          </Text>
        </View>

        <Image
          source={{
            uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFZJdmp88bbPdDhX4D_Bqp1DCegtmjNx0c4rYfvbR3bEQgf60ba4WnzbHLgS3HWhXaAIQIvU-kpznwXUSTcaOgOdBy2mLEmoj9tJMHEtmI8ZZBV2KzERWaOIoC1qz3dlUozjv36Em4mWr_HoJV2PSEgT-1zzxPY1jl0thTv8kLMmdzjiqs53LbgXR8TRIP2QLIp6KYkXMH_MPFbNTjRWD4ur77JvofWXkw4f8isXKvK27u_2j-a2CBUTruWxR-CqpTu7mTCZUKjrDZ",
          }}
          className="w-10 h-10 rounded-full border-2 border-emerald-800"
        />
      </View>

      <ScrollView className="px-4">

        {/* 🔹 Title */}
        <View className="mt-4">
          <View className="flex-row items-center gap-2 mb-1">
            <MaterialIcons name="menu-book" size={22} color="#721e00" />
            <Text className="text-2xl font-bold text-[#012d1d]">
              Jumbo Watch Guide
            </Text>
          </View>
          <Text className="text-gray-600">
            Learn how to use the system effectively for community safety and wildlife protection.
          </Text>
        </View>

        {/* 🔹 Hero */}
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

        {/* 🔹 Card Component */}
        {[
          {
            title: "View Elephant Alerts",
            icon: "notifications",
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuAUKStuPmxt9rLdjiU98OWvNawY75d7SX9jXQ09_Z4gYabuotaXWjrZcShq7rNPQuBy7JuYfk1-zQn3cgoIBhRLU0MhVDJbqE9_IUSJ_ruR2Db4yVIREw4qT-E8P3lAsmujQzlAzO1B89o8QrvU_s2JfdyU-mijPsC12lnusYQcN8vNWDgQblaMEohjyA0H6eOxPim_tYQtyI4ZUgHrBRV89Iu5Q2z2RXpwMcFzahsLKRKveQCTv6Myq0L8nIK_KsZO7FMN9GPJfY5g",
            desc:
              "Stay informed with real-time alerts about elephant sightings near you.",
          },
          {
            title: "Use Live Map Tracking",
            icon: "map",
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuBIctDJq0OrHIv7u1MMLcSihH1UONQnj7qu7dHfjdpNEEJhAxoMKpSwve5u1Mw_ILGo1GnvxWOLhq3rZUZ2eT-UGXGHOBE6L4jsgC0EVDdLGC50xHi_gDfjrG_nkGjUtB_TOKayQWNy__27pGeEvt7fujgaTIYYpSbBNB1hACVC80VrOZcTs6_711F-9qg7MYf6sEUtY8C4g23QAI-I8TknbdeERj2L-LQ8hPYMOYZMd1s9kzbNR5T5nixwfq4UJUrh7jQXRmH8vQO4",
            desc:
              "Monitor movement and safe zones using the live map system.",
          },
          {
            title: "Report Sightings",
            icon: "add-location",
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuCuyTJsJCc1DZLyKVU3z5Msvn-q3bSvL96vxklvhY6E9kv4jenL77sGQjFkHW8kOhSVFN2TdZr_OqXoLBBbrtHbPgbp960-hPgtvXN5XZ0ett_JEHWxwmkZwJyduDC3hemgUC4x4X7YaqKe8MuuU0Ssoc_77FCXx5DI2c7MjIZIL-CF8YtNg4eM99DjkRyvPM118OGH_rhmEnCldLLPpOljXSIxjBMEqMOYaEvp0G65O_08Eu3jsAx3KoZyyPWOkUqP_yuie3dNCl0x",
            desc:
              "Help others by reporting elephant sightings quickly.",
          },
          {
            title: "Manage Your Profile",
            icon: "person",
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuA-C2wYgguP20vFlHZHF8lNkX5Mx-kHG44tm3M1avCTUzJL8tPq4UUDfBg2Dg1sqjK6AdMo_BH1rkKndsp8RNbDbcKPG_9CSm-apuuAmUjVbt3SXotwYR5xH9oaIdCN1B6VkKATNQyaDuviVbrnuc1Ee1AAV7U9R-_vE2F_qaqsHcm3MnQcCG2xm7PSW-UluZ5CymuWPqYLTldrosnGAv4QMjGL1Nk0QoJUHOoGo7T-FrLo3w0UTknNvkMDiQq--Of6gsvVBMOfX3XR",
            desc:
              "Update your preferences and manage your account.",
          },
        ].map((item, index) => (
          <View
            key={index}
            className="mt-5 bg-white rounded-xl p-4 shadow border border-gray-200"
          >
            <Image
              source={{ uri: item.image }}
              className="w-full h-40 rounded-lg mb-3"
            />

            <View className="flex-row items-center gap-2 mb-1">
              <Ionicons name={item.icon as any} size={20} color="#77574d" />
              <Text className="text-lg font-semibold text-[#012d1d]">
                {item.title}
              </Text>
            </View>

            <Text className="text-gray-600">{item.desc}</Text>
          </View>
        ))}

        {/* 🔹 CTA */}
        <TouchableOpacity className="mt-8 mb-20 bg-[#012d1d] py-4 rounded-full items-center">
          <Text className="text-white font-semibold text-lg">
            Ready to Start
          </Text>
        </TouchableOpacity>
      </ScrollView>

      

    </SafeAreaView>
  );
}