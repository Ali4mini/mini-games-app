import { StyleSheet } from "react-native";
import { Theme } from "@/types";

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      marginTop: 3,
      marginBottom: 10,
      height: 46,
    },
    tagContainer: {
      marginRight: 10,
      borderRadius: 25,
    },

    // --- INACTIVE STATE ---
    // Light: White Background + Violet-Gray Border
    // Dark: Slate 800 Background + Slate 700 Border
    tag: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 30,
      backgroundColor: theme.backgroundSecondary, // Changed from #2a2a2a
      borderWidth: 1,
      borderColor: theme.backgroundTertiary,    // Changed from #333
    },

    // --- ACTIVE STATE ---
    // Uses the Theme Primary color (Violet)
    tagActive: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 18,
      borderRadius: 30,
      backgroundColor: theme.primary,
      borderWidth: 1,
      borderColor: theme.primary, // Keeps the border matching the fill

      // Glow Effect
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 6,
      elevation: 6,
    },

    // --- TEXT STYLES ---
    tagText: {
      // Light: Gray 600 | Dark: Gray 300
      // Previously #ccc (which was invisible on white)
      color: theme.textSecondary, 
      fontWeight: "600",
      fontSize: 12,
    },
    
    tagTextActive: {
      // Uses the content color defined in your theme (White)
      color: theme.primaryContent, 
      fontWeight: "800",
      fontSize: 12,
      letterSpacing: 0.3,
    },
  });
};
