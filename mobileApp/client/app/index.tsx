import { useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  StatusBar,
  Dimensions,
  StyleSheet,
  Image,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function Index() {
  // ── Animation values ──────────────────────────────────────
  const logoScale    = useRef(new Animated.Value(0.6)).current;
  const logoOpacity  = useRef(new Animated.Value(0)).current;
  const textOpacity  = useRef(new Animated.Value(0)).current;
  const textY        = useRef(new Animated.Value(20)).current;
  const ring1Scale   = useRef(new Animated.Value(1)).current;
  const ring1Opacity = useRef(new Animated.Value(0.6)).current;
  const ring2Scale   = useRef(new Animated.Value(1)).current;
  const ring2Opacity = useRef(new Animated.Value(0.4)).current;
  const ring3Scale   = useRef(new Animated.Value(1)).current;
  const ring3Opacity = useRef(new Animated.Value(0.25)).current;
  const dotOpacity   = useRef(new Animated.Value(0)).current;

  const pulseRing = (scale: Animated.Value, opacity: Animated.Value, delay: number) =>
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(scale,   { toValue: 2.8, duration: 2200, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0,   duration: 2200, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(scale,   { toValue: 1,   duration: 0,    useNativeDriver: true }),
          Animated.timing(opacity, { toValue: delay === 0 ? 0.6 : delay === 550 ? 0.4 : 0.25, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );

  useEffect(() => {
    // Entry animation sequence
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale,   { toValue: 1,   useNativeDriver: true, tension: 80, friction: 7 }),
        Animated.timing(logoOpacity, { toValue: 1,   duration: 500, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(textY,       { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
      Animated.timing(dotOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();

    // Radar ring pulses
    pulseRing(ring1Scale, ring1Opacity, 0).start();
    pulseRing(ring2Scale, ring2Opacity, 550).start();
    pulseRing(ring3Scale, ring3Opacity, 1100).start();

    // Auth check
    const timer = setTimeout(async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        router.replace("/admin/home");
      } else {
        router.replace("/auth/landing");
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── Radar rings ──────────────────────────────────── */}
      <View style={styles.radarContainer}>
        {[{ scale: ring1Scale, opacity: ring1Opacity },
          { scale: ring2Scale, opacity: ring2Opacity },
          { scale: ring3Scale, opacity: ring3Opacity }].map((r, i) => (
          <Animated.View
            key={i}
            style={[
              styles.ring,
              { transform: [{ scale: r.scale }], opacity: r.opacity },
            ]}
          />
        ))}

        {/* ── Logo icon ────────────────────────────────── */}
        <Animated.View
          style={[styles.logoCircle, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}
        >
          <Image
            source={require("../assets/icon.png")}
            style={styles.iconImage}
            resizeMode="cover"
          />
        </Animated.View>
      </View>

      {/* ── Brand text ───────────────────────────────────── */}
      <Animated.View style={{ opacity: textOpacity, transform: [{ translateY: textY }] }}>
        <Text style={styles.appName}>JumboWatch</Text>
        <Text style={styles.tagline}>Protecting People & Elephants 🐘</Text>
      </Animated.View>

      {/* ── Loading dots ─────────────────────────────────── */}
      <Animated.View style={[styles.dotsRow, { opacity: dotOpacity }]}>
        {[0, 1, 2].map((i) => (
          <BounceDot key={i} delay={i * 180} />
        ))}
      </Animated.View>

      {/* ── Bottom badge ─────────────────────────────────── */}
      <Animated.View style={[styles.badge, { opacity: textOpacity }]}>
        <Ionicons name="shield-checkmark" size={11} color="#4ade80" />
        <Text style={styles.badgeText}>Sri Lanka Wildlife Protection Network</Text>
      </Animated.View>
    </View>
  );
}

/** Individually animated loading dot */
function BounceDot({ delay }: { delay: number }) {
  const y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(y, { toValue: -8, duration: 340, useNativeDriver: true }),
        Animated.timing(y, { toValue:  0, duration: 340, useNativeDriver: true }),
        Animated.delay(600),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.dot, { transform: [{ translateY: y }] }]} />
  );
}

const RING_SIZE = 160;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#012d1d",
    alignItems: "center",
    justifyContent: "center",
    gap: 28,
  },
  radarContainer: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 1.5,
    borderColor: "#4ade80",
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 26,
    overflow: "hidden",
    shadowColor: "#4ade80",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 16,
  },
  iconImage: {
    width: 90,
    height: 90,
    borderRadius: 26,
  },
  appName: {
    fontSize: 34,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  tagline: {
    fontSize: 13,
    color: "#4ade80",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 6,
    letterSpacing: 0.2,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginTop: 4,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#4ade80",
    opacity: 0.85,
  },
  badge: {
    position: "absolute",
    bottom: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(74,222,128,0.1)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(74,222,128,0.2)",
  },
  badgeText: {
    color: "#4ade80",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});