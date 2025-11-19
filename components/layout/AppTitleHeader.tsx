import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Theme } from "@/types";

// --- NEW IMPORTS ---
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

type AppTitleHeaderProps = {
  appName: string;
};

// You can customize these colors to match your brand's new vibe!
const GRADIENT_COLORS = ["#F472B6", "#A78BFA"] as const; // Pink to a soft Purple

export const AppTitleHeader: React.FC<AppTitleHeaderProps> = ({ appName }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      {/* 
        MaskedView acts like a stencil. 
        The 'maskElement' is the shape (our text).
        The children of MaskedView are what gets shown through the stencil.
      */}
      <MaskedView
        style={{ height: 40 }} // Set a height to contain the gradient
        maskElement={<Text style={styles.title}>{appName}</Text>}
      >
        <LinearGradient
          colors={GRADIENT_COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.5 }}
        >
          {/* This text is invisible but is used to give the gradient a size */}
          <Text style={[styles.title, { opacity: 0 }]}>{appName}</Text>
        </LinearGradient>
      </MaskedView>
    </View>
  );
};

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      backgroundColor: theme.backgroundPrimary, // Changed to match the main background
      alignItems: "center",
      justifyContent: "center",
      // Optional: Add a subtle shadow for depth instead of a border
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
      // The color is now handled by the gradient, so we don't need it here.
    },
  });
};
