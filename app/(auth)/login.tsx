import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
  Linking,
  LayoutChangeEvent,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "@/utils/supabase";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Link, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";

// --- Types ---
type LoginForm = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();

  // Breakpoint: Tablet/Desktop
  const isDesktopWeb = Platform.OS === "web" && width > 960;

  // Refs for smooth scrolling
  const scrollViewRef = useRef<ScrollView>(null);
  const loginSectionRef = useRef<number>(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(
    null,
  );

  // --- Theme Colors ---
  const colors = {
    bgDark: "#0B0B15", // Deeper Arcade Black
    bgCard: "#151520",
    primary: "#651FFF",
    secondary: "#D500F9",
    cyan: "#00E5FF", // Neon Cyan
    text: "#FFFFFF",
    textDim: "#8F90A6",
  };

  // --- Dynamic Schema ---
  const loginSchema = z.object({
    email: z.string().email({ message: t("auth.errors.invalidEmail") }),
    password: z.string().min(1, { message: t("auth.errors.passwordRequired") }),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (Platform.OS !== "web") {
      GoogleSignin.configure({
        webClientId: "YOUR_WEB_CLIENT_ID",
        offlineAccess: true,
      });
    }
  }, []);

  // --- Actions ---
  const handleGoogleLogin = async () => {
    // Implement Google Login
  };

  const onEmailSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) Alert.alert(t("auth.loginFailed"), error.message);
      else router.replace("/(tabs)");
    } catch (err) {
      Alert.alert(t("common.error"), t("auth.unexpectedError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToLogin = () => {
    if (scrollViewRef.current) {
      // Offset by a bit to center the form nicely
      scrollViewRef.current.scrollTo({
        y: loginSectionRef.current - 50,
        animated: true,
      });
    }
  };

  // --- Shared Components ---
  const GradientText = (props: any) => {
    if (Platform.OS === "web") {
      return (
        <Text {...props} style={[props.style, { color: colors.cyan }]}>
          {props.children}
        </Text>
      );
    }
    return (
      <MaskedView maskElement={<Text {...props} />}>
        <LinearGradient
          colors={[colors.cyan, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text {...props} style={[props.style, { opacity: 0 }]} />
        </LinearGradient>
      </MaskedView>
    );
  };

  // 1. The Login Form (Console Style)
  const LoginFormComponent = () => (
    <View style={styles.formSection}>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>{t("auth.emailLabel")}</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <BlurView
              intensity={Platform.OS === "web" ? 0 : 20}
              tint="dark"
              style={[
                styles.blurContainer,
                focusedField === "email" && styles.blurFocused,
                errors.email && styles.blurError,
                Platform.OS === "web" && styles.webInputBackground,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={colors.textDim}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder={t("auth.emailPlaceholder")}
                placeholderTextColor={colors.textDim}
                autoCapitalize="none"
                keyboardType="email-address"
                value={value}
                onChangeText={onChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                // @ts-ignore
                outlineStyle="none"
              />
            </BlurView>
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>{t("auth.passwordLabel")}</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <BlurView
              intensity={Platform.OS === "web" ? 0 : 20}
              tint="dark"
              style={[
                styles.blurContainer,
                focusedField === "password" && styles.blurFocused,
                errors.password && styles.blurError,
                Platform.OS === "web" && styles.webInputBackground,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={colors.textDim}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder={t("auth.passwordPlaceholder")}
                placeholderTextColor={colors.textDim}
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                // @ts-ignore
                outlineStyle="none"
              />
            </BlurView>
          )}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}
        <TouchableOpacity style={styles.forgotPass}>
          <Link href={"/(auth)/forgot-password"} style={styles.forgotPassText}>
            {t("auth.forgotPassword")}
          </Link>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleSubmit(onEmailSubmit)}
        disabled={isSubmitting}
        activeOpacity={0.8}
        style={styles.buttonShadowWrapper}
      >
        <LinearGradient
          colors={[colors.secondary, colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>{t("auth.loginButton")}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.socialSection}>
        <Text style={styles.orText}>{t("auth.or")}</Text>
        <View style={{ alignItems: "center", marginTop: 15 }}>
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={handleGoogleLogin}
            disabled={isSubmitting}
            style={
              Platform.OS === "web"
                ? { width: "100%", height: 48, cursor: "pointer" }
                : {}
            }
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{t("auth.newHere")}</Text>
        <TouchableOpacity onPress={() => router.replace("/signup")}>
          <Text style={styles.linkText}>{t("auth.createAccount")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // 2. Mock Game Card Component
  const GameCard = ({
    icon,
    color,
    name,
    genre,
  }: {
    icon: any;
    color: string[];
    name: string;
    genre: string;
  }) => (
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

  // 3. Web Landing Page
  const WebLandingContent = () => (
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
            onPress={() =>
              Alert.alert("Coming Soon", "Browse Catalog feature coming soon!")
            }
          >
            Games
          </Text>
          <Text
            style={styles.navLink}
            onPress={() =>
              Alert.alert("Coming Soon", "Leaderboards feature coming soon!")
            }
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

          {/* Stats Bar */}
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

        {/* Hero Visual - Abstract Phone/Cards */}
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

      {/* Features Grid */}
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
              Don't clutter your storage. Stream games instantly with our HTML5
              engine.
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
              Compete in global leaderboards. High scores unlock exclusive
              avatars.
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
              From retro puzzles to modern 3D racers. New content drops every
              week.
            </Text>
          </View>
        </View>
      </View>

      {/* Login Anchor */}
      <View
        style={styles.loginSectionContainer}
        onLayout={(event: LayoutChangeEvent) => {
          loginSectionRef.current = event.nativeEvent.layout.y;
        }}
      >
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
          <LoginFormComponent />
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

  // --- Main Render ---
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[
            styles.scrollContent,
            !isDesktopWeb && { minHeight: height },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {isDesktopWeb ? (
            <WebLandingContent />
          ) : (
            // Mobile Layout
            <View style={styles.responsiveContainer}>
              <Animated.View
                entering={FadeInDown.delay(100).springify()}
                style={styles.headerContainer}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name="game-controller" size={40} color="#fff" />
                </View>
                <GradientText style={styles.brandTitle}>
                  {t("appName")}
                </GradientText>
                <Text style={styles.subHeader}>Welcome back, Player 1</Text>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(200).springify()}>
                <LoginFormComponent />
              </Animated.View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B15",
  },
  scrollContent: {
    flexGrow: 1,
  },

  // FORM COMMON
  formSection: { width: "100%" },
  inputWrapper: { marginBottom: 20 },
  label: {
    fontSize: 13,
    color: "#8F90A6",
    marginBottom: 8,
    marginLeft: 4,
    fontFamily: "Poppins-Medium",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  blurContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    height: 56,
    paddingHorizontal: 16,
    overflow: "hidden",
  },
  webInputBackground: { backgroundColor: "#151520" }, // Solid for web
  blurFocused: {
    borderColor: "#00E5FF",
    backgroundColor: "rgba(0, 229, 255, 0.05)",
  },
  blurError: { borderColor: "#FF5252" },
  inputIcon: { marginRight: 12 },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    height: "100%",
  },
  errorText: { color: "#FF5252", fontSize: 12, marginTop: 6 },
  forgotPass: { alignSelf: "flex-end", marginTop: 8 },
  forgotPassText: { color: "#8F90A6", fontSize: 13, cursor: "pointer" },
  buttonShadowWrapper: {
    marginTop: 10,
    shadowColor: "#D500F9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  gradientButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    cursor: "pointer",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  socialSection: { marginTop: 30 },
  orText: {
    color: "#555",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 10,
  },
  footer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: { color: "#8F90A6", fontSize: 14, marginRight: 6 },
  linkText: {
    color: "#00E5FF",
    fontSize: 14,
    fontWeight: "bold",
    cursor: "pointer",
  },

  // MOBILE SPECIFIC
  responsiveContainer: {
    width: "100%",
    paddingHorizontal: 24,
    paddingBottom: 40,
    maxWidth: 450,
    alignSelf: "center",
    justifyContent: "center",
    flex: 1,
  },
  headerContainer: { alignItems: "center", marginBottom: 40 },
  iconContainer: {
    marginBottom: 15,
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: "900",
    fontFamily: "LilitaOne",
    marginBottom: 5,
  },
  subHeader: { fontSize: 16, color: "#8F90A6" },

  // WEB LANDING
  webContainer: { width: "100%", alignItems: "center" },

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
    cursor: "pointer",
    transition: "0.2s",
  },
  webNavButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    cursor: "pointer",
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
    cursor: "pointer",
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
    cursor: "pointer",
  },
  secondaryCtaText: { color: "#FFF", fontWeight: "600", fontSize: 16 },

  statsRow: { flexDirection: "row", alignItems: "center", gap: 20 },
  statDivider: { width: 1, height: 30, backgroundColor: "#333" },
  statNumber: { color: "#FFF", fontSize: 24, fontWeight: "bold" },
  statLabel: { color: "#666", fontSize: 12, textTransform: "uppercase" },

  // Hero Visuals (Cards)
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

  // Game Card Style
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

  webFooter: {
    width: "100%",
    padding: 40,
    borderTopWidth: 1,
    borderTopColor: "#222",
    alignItems: "center",
    gap: 15,
  },
  footerCopy: { color: "#444", fontSize: 14 },
  footerLink: { color: "#666", fontSize: 14, cursor: "pointer" },
});
