import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, useThemeControl } from "@/context/ThemeContext";

const ThemeToggle: React.FC = () => {
  const theme = useTheme();
  const { isDark, toggleTheme } = useThemeControl();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundSecondary,
          borderColor: theme.backgroundTertiary,
        },
      ]}
    >
      {/* Icon: Sun (Orange) vs Moon (Violet) */}
      <Ionicons
        name={isDark ? "moon" : "sunny"}
        size={14}
        color={isDark ? theme.primary : theme.warning}
        style={styles.icon}
      />
      
      {/* Label: Dynamic Text */}
      <Text style={[styles.text, { color: theme.textSecondary }]}>
        {isDark ? "DARK" : "LIGHT"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    // Consistent subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginRight: 8, // Spacing if placed next to LanguageSelector
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});

export default ThemeToggle;
