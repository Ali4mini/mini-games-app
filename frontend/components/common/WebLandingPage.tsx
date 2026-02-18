import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import LoginForm from "@/app/(auth)/login";

// --- Helpers ---
const colors = {
  bgDark: "#0B0B15",
  primary: "#651FFF",
  secondary: "#D500F9",
  cyan: "#00E5FF",
  text: "#FFFFFF",
};

const GradientText = (props: any) => (
  <Text {...props} style={[props.style, { color: colors.cyan }]}>
    {props.children}
  </Text>
);

const GameCard = ({ icon, color, name, genre }: any) => (
  <View style={styles.gameCard}>
    <LinearGradient colors={color} style={styles.gameCardVisual}>
      <MaterialCommunityIcons name={icon} size={40} color="white" />
    </LinearGradient>
    <View style={styles.gameCardInfo}>
      <Text style={styles.gameName}>{name}</Text>
      <Text style={styles.gameGenre}>{genre}</Text>
    </View>
  </View>
);

export default function WebLandingPage() {
  const loginSectionRef = useRef<View>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToLogin = () => {
    // Basic scroll implementation for web
    // @ts-ignore - 'measure' exists on Views in RN Web
    loginSectionRef.current?.measure((x, y, width, height, pageX, pageY) => {
      window.scrollTo({ top: pageY - 50, behavior: "smooth" });
    });
  };

  return (
    <View style={styles.webContainer}>
      {/* Navbar */}
      <View style={styles.webNavbar}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.navLogoBg}>
            <Ionicons name="game-controller" size={22} color="#FFF" />
          </View>
          <Text style={styles.webNavTitle}>MysteryPlay</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
          <Text
            style={styles.navLink}
            onPress={() => Alert.alert("Soon", "Coming soon!")}
          >
            Games
          </Text>
          <Text
            style={styles.navLink}
            onPress={() => Alert.alert("Soon", "Coming soon!")}
          >
            Leaderboard
          </Text>
          <TouchableOpacity onPress={scrollToLogin} style={styles.webNavButton}>
            <Text style={styles.webNavButtonText}>Login to Hub</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Section */}
      <View style={styles.webHeroSection}>
        <View style={styles.webHeroContent}>
          <View style={styles.betaTag}>
            <Text style={styles.betaText}>NEW: DAILY CHALLENGES</Text>
          </View>
          <GradientText style={styles.webHeroTitle}>
            Your Pocket Arcade.
          </GradientText>
          <Text style={styles.webHeroSubtitle}>
            Access hundreds of premium mini-games instantly. No downloads. Just
            pure gameplay powered by{" "}
            <Text style={{ color: colors.cyan }}>Famobi</Text> &{" "}
            <Text style={{ color: colors.cyan }}>AdMob</Text>.
          </Text>

          <View style={styles.webHeroButtons}>
            <TouchableOpacity style={styles.primaryCta} onPress={scrollToLogin}>
              <Text style={styles.primaryCtaText}>Start Playing Now</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryCta}
              onPress={() => Linking.openURL("https://google.com")}
            >
              <Ionicons name="logo-android" size={20} color="white" />
              <Text style={styles.secondaryCtaText}>Get the App</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>Games</Text>
            </View>
            <View style={styles.statDivider} />
            <View>
              <Text style={styles.statNumber}>0s</Text>
              <Text style={styles.statLabel}>Wait Time</Text>
            </View>
            <View style={styles.statDivider} />
            <View>
              <Text style={styles.statNumber}>100%</Text>
              <Text style={styles.statLabel}>Free to Play</Text>
            </View>
          </View>
        </View>

        {/* Hero Visual */}
        <View style={styles.webHeroVisual}>
          <View style={styles.floatingCard1}>
            <GameCard
              icon="sword-cross"
              color={["#FF4B1F", "#FF9068"]}
              name="Dungeon Run"
              genre="Action RPG"
            />
          </View>
          <View style={styles.floatingCard2}>
            <GameCard
              icon="cards-playing-outline"
              color={["#8E2DE2", "#4A00E0"]}
              name="Solitaire Pro"
              genre="Card Game"
            />
          </View>
          <View style={styles.floatingCard3}>
            <GameCard
              icon="ghost"
              color={["#00b09b", "#96c93d"]}
              name="Spooky Jump"
              genre="Arcade"
            />
          </View>
        </View>
      </View>

      {/* Features */}
      <View style={styles.featureSection}>
        <Text style={styles.sectionHeader}>Why MysteryPlay?</Text>
        <View style={styles.featuresGrid}>
          <View style={styles.featureBox}>
            <View
              style={[
                styles.featureIcon,
                { backgroundColor: "rgba(0,229,255,0.1)" },
              ]}
            >
              <Ionicons
                name="cloud-download-outline"
                size={30}
                color={colors.cyan}
              />
            </View>
            <Text style={styles.featureTitle}>No Downloads</Text>
            <Text style={styles.featureDesc}>
              Don't clutter your storage. Stream games instantly.
            </Text>
          </View>
          <View style={styles.featureBox}>
            <View
              style={[
                styles.featureIcon,
                { backgroundColor: "rgba(213,0,249,0.1)" },
              ]}
            >
              <Ionicons
                name="trophy-outline"
                size={30}
                color={colors.secondary}
              />
            </View>
            <Text style={styles.featureTitle}>Win Rewards</Text>
            <Text style={styles.featureDesc}>
              Compete in global leaderboards for exclusive avatars.
            </Text>
          </View>
          <View style={styles.featureBox}>
            <View
              style={[
                styles.featureIcon,
                { backgroundColor: "rgba(101,31,255,0.1)" },
              ]}
            >
              <Ionicons
                name="infinite-outline"
                size={30}
                color={colors.primary}
              />
            </View>
            <Text style={styles.featureTitle}>Infinite Variety</Text>
            <Text style={styles.featureDesc}>
              From retro puzzles to modern 3D racers.
            </Text>
          </View>
        </View>
      </View>

      {/* Login Anchor */}
      <View style={styles.loginSectionContainer} ref={loginSectionRef}>
        <LinearGradient
          colors={["transparent", "rgba(101,31,255,0.1)"]}
          style={styles.loginBgGradient}
        />
        <View style={styles.webCardContainer}>
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Ionicons name="finger-print" size={50} color={colors.secondary} />
            <Text style={styles.webCardHeader}>Enter the Arcade</Text>
            <Text style={styles.webCardSub}>
              Sync your progress across Web & Mobile
            </Text>
          </View>
          {/* Reuse the Logic Component */}
          <LoginForm />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.webFooter}>
        <Text style={styles.footerCopy}>
          © 2025 MysteryPlay. Powered by Expo & Supabase.
        </Text>
        <View style={{ flexDirection: "row", gap: 20 }}>
          <Text style={styles.footerLink}>Privacy</Text>
          <Text style={styles.footerLink}>Terms</Text>
          <Text style={styles.footerLink}>Contact</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#0B0B15",
  },
  // Navbar
  webNavbar: {
    width: "100%",
    maxWidth: 1200,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 24,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  navLogoBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#651FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  webNavTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 12,
    fontFamily: "LilitaOne",
    letterSpacing: 1,
  },
  navLink: {
    color: "#AAA",
    fontSize: 15,
    fontWeight: "600",
    cursor: "pointer" as any,
    transition: "0.2s",
  },
  webNavButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    cursor: "pointer" as any,
  },
  webNavButtonText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  // Hero
  webHeroSection: {
    width: "100%",
    maxWidth: 1200,
    flexDirection: "row",
    paddingHorizontal: 40,
    paddingTop: 60,
    paddingBottom: 80,
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
  webHeroContent: { flex: 1, minWidth: 350, paddingRight: 40 },
  betaTag: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(213,0,249,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(213,0,249,0.3)",
  },
  betaText: {
    color: "#D500F9",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  webHeroTitle: {
    fontSize: 64,
    fontWeight: "900",
    fontFamily: "LilitaOne",
    lineHeight: 72,
    marginBottom: 20,
  },
  webHeroSubtitle: {
    color: "#8F90A6",
    fontSize: 18,
    lineHeight: 30,
    marginBottom: 40,
    maxWidth: 500,
  },
  webHeroButtons: { flexDirection: "row", gap: 16, marginBottom: 40 },
  primaryCta: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#00E5FF",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#00E5FF",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    cursor: "pointer" as any,
  },
  primaryCtaText: { color: "#000", fontWeight: "bold", fontSize: 16 },
  secondaryCta: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#333",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    alignItems: "center",
    cursor: "pointer" as any,
  },
  secondaryCtaText: { color: "#FFF", fontWeight: "600", fontSize: 16 },
  statsRow: { flexDirection: "row", alignItems: "center", gap: 20 },
  statDivider: { width: 1, height: 30, backgroundColor: "#333" },
  statNumber: { color: "#FFF", fontSize: 24, fontWeight: "bold" },
  statLabel: { color: "#666", fontSize: 12, textTransform: "uppercase" },
  // Hero Visuals
  webHeroVisual: { width: 450, height: 450, position: "relative" },
  floatingCard1: {
    position: "absolute",
    top: 0,
    right: 0,
    transform: [{ rotate: "10deg" }],
  },
  floatingCard2: {
    position: "absolute",
    top: 120,
    left: 20,
    transform: [{ rotate: "-5deg" }],
    zIndex: 2,
  },
  floatingCard3: {
    position: "absolute",
    bottom: 20,
    right: 40,
    transform: [{ rotate: "5deg" }],
  },
  gameCard: {
    width: 200,
    backgroundColor: "#1A1A24",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  gameCardVisual: {
    height: 110,
    justifyContent: "center",
    alignItems: "center",
  },
  gameCardInfo: { padding: 12 },
  gameName: { color: "#FFF", fontWeight: "bold", fontSize: 15 },
  gameGenre: { color: "#666", fontSize: 12, marginTop: 2 },
  // Features
  featureSection: { width: "100%", maxWidth: 1200, padding: 40 },
  sectionHeader: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 50,
    fontFamily: "LilitaOne",
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 30,
  },
  featureBox: {
    width: 300,
    padding: 30,
    backgroundColor: "#13131D",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#222",
    alignItems: "center",
    textAlign: "center",
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  featureTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  featureDesc: {
    color: "#8F90A6",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
  // Login Anchor
  loginSectionContainer: {
    width: "100%",
    paddingVertical: 80,
    alignItems: "center",
    position: "relative",
  },
  loginBgGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 400,
  },
  webCardContainer: {
    maxWidth: 450,
    width: "90%",
    backgroundColor: "#151520",
    borderRadius: 24,
    padding: 40,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 30,
  },
  webCardHeader: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  webCardSub: { color: "#666", fontSize: 14 },
  // Footer
  webFooter: {
    width: "100%",
    padding: 40,
    borderTopWidth: 1,
    borderTopColor: "#222",
    alignItems: "center",
    gap: 15,
  },
  footerCopy: { color: "#444", fontSize: 14 },
  footerLink: { color: "#666", fontSize: 14, cursor: "pointer" as any },
});
