import React from "react";
import { View, Text, useColorScheme, StyleSheet } from "react-native";
import colors from "@/constants/Colors"; // Adjust path as needed

const AirdropScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const currentColors = colors[colorScheme || "light"];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentColors.backgroundPrimary },
      ]}
    >
      <View style={styles.content}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: "rgba(244, 63, 94, 0.1)" },
          ]}
        >
          <Text style={[styles.emoji, { color: currentColors.primary }]}>
            🎁
          </Text>
        </View>

        <Text style={[styles.title, { color: currentColors.textPrimary }]}>
          Airdrop
        </Text>

        <Text style={[styles.subtitle, { color: currentColors.textSecondary }]}>
          Coming Soon!
        </Text>

        <View
          style={[
            styles.divider,
            { backgroundColor: "rgba(244, 63, 94, 0.3)" },
          ]}
        />

        <Text
          style={[styles.description, { color: currentColors.textTertiary }]}
        >
          Get ready for exciting rewards and exclusive tokens. Follow us for
          updates on our upcoming airdrop event.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    maxWidth: 400,
    width: "100%",
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
    opacity: 0.8,
  },
  divider: {
    width: 60,
    height: 4,
    borderRadius: 2,
    marginVertical: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 16,
  },
});

export default AirdropScreen;
