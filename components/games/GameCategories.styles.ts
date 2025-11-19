import { StyleSheet } from "react-native";
import { Theme } from "@/types";

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      marginTop: 3,
      marginBottom: 10,
      height: 46, // Fixed height container
    },
    tagContainer: {
      marginRight: 10,
      borderRadius: 25,
    },

    // INACTIVE (Dark Glassy)
    tag: {
      flexDirection: "row", // Align icon and text
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 30,
      backgroundColor: "#2a2a2a",
      borderWidth: 1,
      borderColor: "#333",
    },

    // ACTIVE (Glowing Theme Color)
    tagActive: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 18,
      borderRadius: 30,
      backgroundColor: theme.primary, // Your Gold/Pink theme color
      borderWidth: 1,
      borderColor: "#fff",

      // Glow Effect
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 6,
      elevation: 6,
    },

    // Text Styles
    tagText: {
      color: "#ccc", // Light grey
      fontWeight: "600",
      fontSize: 12,
    },
    tagTextActive: {
      color: "#000", // Black looks best on bright Gold/Neon colors
      fontWeight: "800",
      fontSize: 12,
      letterSpacing: 0.3,
    },
  });
};
