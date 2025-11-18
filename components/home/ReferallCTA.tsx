import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";

import { useTheme } from "@/context/ThemeContext";
import { Theme } from "@/types";

export const ReferralCTA: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Link href="/profile" asChild>
      <TouchableOpacity style={styles.referralContainer}>
        <FontAwesome5 name="user-friends" size={30} color={theme.primary} />
        <View style={styles.referralTextContainer}>
          <Text style={styles.referralTitle}>{t("home.referralTitle")}</Text>
          <Text style={styles.referralSubtitle}>
            {t("home.referralSubtitle", { count: 500 })}
          </Text>
        </View>
        <Feather name="chevron-right" size={24} color={theme.primary} />
      </TouchableOpacity>
    </Link>
  );
};

// --- STYLES ---
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    referralContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.backgroundSecondary,
      padding: 20,
      borderRadius: 15,
      marginHorizontal: 20,
      marginTop: 30,
    },
    referralTextContainer: {
      flex: 1,
      marginLeft: 15,
    },
    referralTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.textPrimary,
    },
    referralSubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 4,
    },
  });
