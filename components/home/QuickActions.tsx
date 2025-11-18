import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";

import { useTheme } from "@/context/ThemeContext";
import { Theme } from "@/types";

export const QuickActions: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.quickActionsContainer}>
      <Link href="/daily-check" asChild>
        <TouchableOpacity style={styles.quickAction}>
          <Feather name="calendar" size={24} color="#FFF" />
          <Text style={styles.quickActionText}>{t("home.dailyCheckIn")}</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/leaderboard" asChild>
        <TouchableOpacity style={styles.quickAction}>
          <FontAwesome5 name="leaderboard" size={24} color="#FFF" />
          <Text style={styles.quickActionText}>{t("leaderboard.title")}</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/lucky-spin" asChild>
        <TouchableOpacity style={styles.quickAction}>
          <FontAwesome5 name="compact-disc" size={24} color="#FFF" />
          <Text style={styles.quickActionText}>{t("home.luckySpin")}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

// --- STYLES ---
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    quickActionsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingHorizontal: 10,
      marginTop: 20,
    },
    quickAction: {
      backgroundColor: theme.secondary,
      padding: 15,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      width: "30%",
      aspectRatio: 1, // Makes it a square
    },
    quickActionText: {
      color: "#FFF",
      marginTop: 8,
      fontWeight: "600",
      fontSize: 12,
      textAlign: "center",
    },
  });
