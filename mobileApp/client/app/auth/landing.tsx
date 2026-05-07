import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=1200",
    tag: "Real-Time Monitoring",
    tagIcon: "radio" as const,
    headline: "Stay One Step\nAhead",
    sub: "Monitor wildlife movements nearby and notify your community before surprise encounters occur.",
  },
  {
    image: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=1200",
    tag: "Community Watch",
    tagIcon: "people" as const,
    headline: "Protect Your\nVillage",
    sub: "Join thousands of guardians across Sri Lanka safeguarding both people and elephants.",
  },
  {
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=1200",
    tag: "Safe Zone Mapping",
    tagIcon: "map" as const,
    headline: "Know Your\nSafe Zones",
    sub: "Live geofencing alerts keep you informed of elephant migration routes around your area.",
  },
];

export default function LandingScreen() {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  // Auto-slide effect (4 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => {
        const nextSlide = (prev + 1) % SLIDES.length;
        scrollRef.current?.scrollTo({ x: nextSlide * width, animated: true });
        return nextSlide;
      });
    }, 4000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  const goToSlide = (index: number) => {
    setActiveSlide(index);
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const handleScroll = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveSlide(index);
  };

  const slide = SLIDES[activeSlide];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#012d1d" }}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ─── FULL-BLEED HERO CAROUSEL ─────────────────── */}
      <View style={{ height: height * 0.52, position: "relative" }}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
          style={{ flex: 1 }}
        >
          {SLIDES.map((s, i) => (
            <ImageBackground
              key={i}
              source={{ uri: s.image }}
              style={{ width, height: height * 0.52, justifyContent: "flex-end" }}
            >
              {/* Gradient overlay */}
              <View
                style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: "rgba(1, 45, 29, 0.55)",
                }}
              />
            </ImageBackground>
          ))}
        </ScrollView>

        {/* TOP BAR — Lowered and Centered */}
        <View
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            paddingTop: 50, // Pushed lower down the screen
            flexDirection: "row",
            justifyContent: "center", // Centers the brand logo
            alignItems: "center",
          }}
        >
          {/* Brand */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: "rgba(187,247,208,0.18)",
                borderWidth: 1,
                borderColor: "rgba(187,247,208,0.3)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="shield-checkmark" size={18} color="#bbf7d0" />
            </View>
            <Text style={{ color: "#fff", fontWeight: "900", fontSize: 17, letterSpacing: 0.2 }}>
              Jumbo Watch
            </Text>
          </View>

          {/* Language pill - Absolutely positioned to stay out of the way of the centered logo */}
          <View style={{ position: "absolute", right: 22, top: 50 }}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "rgba(255,255,255,0.14)",
                paddingHorizontal: 12,
                paddingVertical: 7,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.22)",
              }}
            >
              <Ionicons name="language" size={14} color="#fff" />
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>
                භාෂාව
              </Text>
              <Ionicons name="chevron-down" size={12} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ACTIVE SLIDE TAG + DOTS — overlaid bottom of image */}
        <View
          style={{
            position: "absolute",
            bottom: 70, // Moved up slightly to account for the higher white tab
            left: 22,
            right: 22,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Tag pill */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: "rgba(0,0,0,0.4)",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "rgba(74,222,128,0.4)",
            }}
          >
            <Ionicons name={slide.tagIcon} size={12} color="#4ade80" />
            <Text style={{ color: "#4ade80", fontSize: 11, fontWeight: "700", letterSpacing: 0.8 }}>
              {slide.tag.toUpperCase()}
            </Text>
          </View>

          {/* Dot indicators */}
          <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
            {SLIDES.map((_, i) => (
              <TouchableOpacity key={i} onPress={() => goToSlide(i)}>
                <View
                  style={{
                    height: 4,
                    width: i === activeSlide ? 24 : 8,
                    borderRadius: 2,
                    backgroundColor: i === activeSlide ? "#4ade80" : "rgba(255,255,255,0.35)",
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* ─── CONTENT CARD ─────────────────────────────── */}
      <View
        style={{
          flex: 1,
          backgroundColor: "#fcf9f8",
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
          marginTop: -50, // Increased to pull the white tab further up
          paddingHorizontal: 24,
          paddingTop: 36,
          paddingBottom: 32,
          justifyContent: "space-between",
        }}
      >
        {/* Text content */}
        <View>
          <Text
            style={{
              fontSize: 38,
              fontWeight: "900",
              color: "#012d1d",
              lineHeight: 44,
              letterSpacing: -0.5,
              textAlign: "center", // Centered text
            }}
          >
            {slide.headline}
          </Text>

          <Text
            style={{
              fontSize: 15,
              color: "#6b7280",
              marginTop: 16,
              lineHeight: 24,
              fontWeight: "500",
              textAlign: "center", // Centered text
              paddingHorizontal: 10,
            }}
          >
            {slide.sub}
          </Text>
        </View>

        {/* ─── BUTTONS ──────────────────────────────────── */}
        <View style={{ gap: 16, marginTop: 40 }}>

          {/* LOG IN */}
          <TouchableOpacity
            onPress={() => router.push("/auth/login")}
            style={{
              backgroundColor: "#012d1d",
              height: 64, // Big touch target
              borderRadius: 18,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#012d1d",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.35,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800" }}>
              Log In
            </Text>
          </TouchableOpacity>

          {/* SIGN UP */}
          <TouchableOpacity
            onPress={() => router.push("/auth/register")}
            style={{
              backgroundColor: "#bbf7d0", // Solid theme color background
              height: 64, // Big touch target
              borderRadius: 18,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#012d1d", fontSize: 18, fontWeight: "800" }}>
              Create Account
            </Text>
          </TouchableOpacity>

          {/* Footer note */}
          <Text
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "#9ca3af",
              marginTop: 12,
            }}
          >
            Protecting Sri Lanka's elephants & communities 🐘
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}