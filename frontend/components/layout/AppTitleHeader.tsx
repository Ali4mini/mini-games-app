import React, { useMemo } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Theme } from "@/types";

// Import libraries conditionally or handle usage carefully
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

type AppTitleHeaderProps = {
  appName: string;
};

const GRADIENT_COLORS = ["#7C3AED", "#06B6D4"] as const;

export const AppTitleHeader: React.FC<AppTitleHeaderProps> = ({ appName }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // 1. CHECK FOR WEB
  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.primary }]}>{appName}</Text>
      </View>
    );
  }

  // 2. RENDER FOR NATIVE (iOS/Android)
  return (
    <View style={styles.container}>
      <MaskedView
        style={{ height: 40, width: "100%" }} // Ensure width is set
        maskElement={
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text style={styles.title}>{appName}</Text>
          </View>
        }
      >
        <LinearGradient
          colors={GRADIENT_COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.5 }}
          style={{ flex: 1 }} // Ensure gradient fills the MaskedView
        />
      </MaskedView>
    </View>
  );
};

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      backgroundColor: theme.backgroundPrimary,
      alignItems: "center",
      justifyContent: "center",
      // On web, box-shadow is usually handled differently,
      // but elevation works decently for React Native Web too.
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    title: {
      fontFamily: "LilitaOne",
      fontSize: 32,
      letterSpacing: 1.5,
      textAlign: "center", // Ensure text centers properly
    },
  });
};
