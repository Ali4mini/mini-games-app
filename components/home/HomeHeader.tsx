import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { useTheme } from "@/context/ThemeContext";
import { Theme } from "@/types";

interface HomeHeaderProps {
  userName: string;
  coins: number;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ userName, coins }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerWelcome}>{t("home.welcomeBack")}</Text>
        <Text style={styles.headerUsername}>{userName}</Text>
      </View>
      <View style={styles.coinsContainer}>
        <FontAwesome5 name="coins" size={20} color="#FFD700" />
        <Text style={styles.coinsText}>{coins}</Text>
      </View>
    </View>
  );
};

// --- STYLES ---
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 20,
    },
    headerWelcome: {
      fontSize: 16,
      color: theme.textSecondary,
    },
    headerUsername: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.textPrimary,
    },
    coinsContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.backgroundSecondary,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
    },
    coinsText: {
      marginLeft: 8,
      fontSize: 16,
      fontWeight: "bold",
      color: theme.textPrimary,
    },
  });
