// app/(admin)/overview.jsx

import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function Overview() {
  const router = useRouter();

  const cards = [
    {
      title: "Sightings",
      subtitle: "Latest Alerts",
      icon: "warning",
      route: "/admin/sighting-alerts",
      image:
        "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=1000",
    },
    {
      title: "Map",
      subtitle: "Safe Zones",
      icon: "map",
      route: "/admin/geofencing",
      image:
        "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=1000",
    },
    {
      title: "Upload",
      subtitle: "Report Info",
      icon: "camera",
      route: "/admin/upload-image",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000",
    },
    {
      title: "Profile",
      subtitle: "My Account",
      icon: "person",
      route: "/admin/my-profile",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1000",
    },
  ];
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fcf9f8" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>🐘 Jumbo Watch</Text>

            <View style={styles.statusRow}>
              <View style={styles.dot} />
              <Text style={styles.active}>System Active</Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => router.push("/admin/Instructions")}>
            <Ionicons
              name="notifications-outline"
              size={28}
              color="#064e3b"
            />
          </TouchableOpacity>
        </View>

        {/* HERO SECTION */}
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=1200",
          }}
          style={styles.hero}
          imageStyle={{ borderRadius: 22 }}
        >
          <View style={styles.overlay} />

          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              Real-time elephant monitoring & safety intelligence
            </Text>

            <Text style={styles.heroSub}>
              Empowering communities through smart wildlife protection systems.
            </Text>
          </View>
        </ImageBackground>

        {/* STATS */}
        {/* <View style={styles.bigCard}>
          <Text style={styles.cardTitle}>Live Alert Network</Text>
          <Text style={styles.cardSub}>
            Current activity in your area is stable.
          </Text>

          <View style={styles.statsRow}>
            <StatItem number="12" label="PATROLS" />
            <Divider />
            <StatItem number="2" label="SIGHTINGS" />
            <Divider />
            <StatItem number="98%" label="SAFE ZONES" green />
          </View>
        </View> */}

        {/* COMMUNITY CARD */}
        {/* <View style={styles.communityCard}>
          <Ionicons
            name="shield-checkmark"
            size={42}
            color="#bbf7d0"
          />

          <Text style={styles.communityTitle}>Community Watch</Text>

          <Text style={styles.communityText}>
            Your contributions help keep villages safe while protecting elephant
            migration routes.
          </Text>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>View Leaderboard</Text>
          </TouchableOpacity>
        </View> */}

        {/* GRID */}
        <Text style={styles.sectionTitle}>Navigation Hub</Text>

        <View style={styles.grid}>
          {cards.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.gridCard}
              activeOpacity={0.9}
              onPress={() => router.push(item.route)}
            >
              <ImageBackground
                source={{ uri: item.image }}
                style={styles.gridImage}
                imageStyle={{ borderRadius: 18 }}
              >
                <View style={styles.gridOverlay} />

                <View style={styles.gridContent}>
                  <Ionicons
                    name={item.icon}
                    size={24}
                    color="#fff"
                  />

                  <Text style={styles.gridTitle}>{item.title}</Text>

                  <Text style={styles.gridSub}>{item.subtitle}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>

      {/* FLOAT BUTTON */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/admin/upload-image")}
      >
        <Ionicons name="add" size={34} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

function StatItem({ number, label, green }) {
  return (
    <View style={{ alignItems: "center" }}>
      <Text
        style={[
          styles.statNumber,
          green && { color: "#10b981" },
        ]}
      >
        {number}
      </Text>

      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcf9f8",
    paddingHorizontal: 16,
  },

  header: {
    marginTop: 55,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    fontSize: 28,
    fontWeight: "900",
    color: "#064e3b",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: "#10b981",
    marginRight: 6,
  },

  active: {
    color: "#10b981",
    fontWeight: "700",
    fontSize: 12,
  },

  hero: {
    height: 260,
    justifyContent: "flex-end",
    overflow: "hidden",
    marginBottom: 18,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.38)",
    borderRadius: 22,
  },

  heroContent: {
    padding: 18,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 27,
    fontWeight: "900",
  },

  heroSub: {
    color: "#d1fae5",
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
  },

  bigCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#064e3b",
  },

  cardSub: {
    marginTop: 6,
    color: "#666",
  },

  statsRow: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statNumber: {
    fontSize: 28,
    fontWeight: "900",
    color: "#064e3b",
  },

  statLabel: {
    fontSize: 11,
    color: "#666",
    marginTop: 4,
  },

  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#ddd",
  },

  communityCard: {
    backgroundColor: "#1b4332",
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
  },

  communityTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 12,
  },

  communityText: {
    color: "#d1fae5",
    marginTop: 8,
    lineHeight: 22,
  },

  button: {
    backgroundColor: "#bbf7d0",
    marginTop: 18,
    paddingVertical: 12,
    borderRadius: 14,
  },

  buttonText: {
    textAlign: "center",
    color: "#064e3b",
    fontWeight: "900",
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#064e3b",
    marginBottom: 14,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  gridCard: {
    width: width / 2 - 24,
    height: width / 2 - 24,
    marginBottom: 14,
  },

  gridImage: {
    flex: 1,
    justifyContent: "flex-end",
  },

  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.38)",
    borderRadius: 18,
  },

  gridContent: {
    padding: 14,
  },

  gridTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 6,
  },

  gridSub: {
    color: "#ddd",
    fontSize: 12,
    marginTop: 2,
  },

  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#7c2d12",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
});