import React, { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions, // <--- 1. Import hook
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";

import { useTheme } from "@/context/ThemeContext";
import { Theme } from "@/types";

export const ReferralCTA: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768; // <--- 2. Define breakpoint

  // Pass isDesktop to the style creation function
  const styles = useMemo(
    () => createStyles(theme, isDesktop),
    [theme, isDesktop],
  );

  // Define icon size dynamically
  const giftIconSize = isDesktop ? 36 : 28;

  return (
    <Link href="/profile" asChild>
      <TouchableOpacity activeOpacity={0.9} style={styles.containerWrapper}>
        <LinearGradient
          colors={["#6a11cb", "#2575fc"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name="gift-open-outline"
              size={giftIconSize} // <--- 3. Use dynamic icon size
              color="#fff"
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>
              {t("home.referralTitle", "Refer a Friend")}
            </Text>
            <Text style={styles.subtitle}>
              {t("home.referralSubtitle", {
                count: 500,
                defaultValue: "Get 500 coins!",
              })}
            </Text>
          </View>

          <View style={styles.actionBtn}>
            <Text style={styles.btnText}>INVITE</Text>
            <Ionicons name="arrow-forward" size={12} color="#2575fc" />
          </View>

          <View style={styles.decoCircle1} />
          <View style={styles.decoCircle2} />
        </LinearGradient>
      </TouchableOpacity>
    </Link>
  );
};

// --- STYLES ---
// 4. Update createStyles to accept the isDesktop boolean
const createStyles = (theme: Theme, isDesktop: boolean) =>
  StyleSheet.create({
    containerWrapper: {
      marginHorizontal: 20,
      marginTop: isDesktop ? 30 : 20, // More space on desktop
      marginBottom: isDesktop ? 20 : 10,
      shadowColor: "#2575fc",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    gradient: {
      flexDirection: "row",
      alignItems: "center",
      padding: isDesktop ? 24 : 16, // More padding on desktop
      borderRadius: 20,
      position: "relative",
      overflow: "hidden",
    },
    iconCircle: {
      width: isDesktop ? 60 : 50, // Bigger icon circle
      height: isDesktop ? 60 : 50,
      borderRadius: isDesktop ? 30 : 25,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
      marginRight: isDesktop ? 20 : 15,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.3)",
      zIndex: 2,
    },
    textContainer: {
      flex: 1,
      zIndex: 2,
    },
    title: {
      fontSize: isDesktop ? 20 : 16, // Bigger font
      fontWeight: "800",
      color: "#fff",
      marginBottom: 2,
      letterSpacing: 0.5,
    },
    subtitle: {
      fontSize: isDesktop ? 14 : 12, // Bigger font
      color: "rgba(255,255,255,0.9)",
      fontWeight: "500",
    },
    actionBtn: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      paddingHorizontal: isDesktop ? 16 : 12, // Bigger button padding
      paddingVertical: isDesktop ? 10 : 8,
      borderRadius: 20,
      gap: 4,
      zIndex: 2,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    btnText: {
      color: "#2575fc",
      fontSize: isDesktop ? 12 : 10, // Bigger button text
      fontWeight: "800",
    },
    decoCircle1: {
      position: "absolute",
      top: -20,
      left: -20,
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: "rgba(255,255,255,0.08)",
      zIndex: 1,
    },
    decoCircle2: {
      position: "absolute",
      bottom: -30,
      right: 50,
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "rgba(255,255,255,0.05)",
      zIndex: 1,
    },
  });
