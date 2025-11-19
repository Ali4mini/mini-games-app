import { StyleSheet } from "react-native";
import { Theme } from "../../types/index";

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    sectionContainer: {
      marginTop: 20, // Reduced slightly so it doesn't feel detached
      marginBottom: 10,
    },
    title: {
      fontSize: 18, // 18 is standard for section headers
      fontWeight: "800", // Extra bold looks more "Gaming"
      color: theme.textPrimary,
      marginLeft: 20,
      marginBottom: 12,
      letterSpacing: 0.5,
    },
    // THE CARD
    card: {
      width: 160, // Bigger width
      height: 100, // Bigger height (16:10 ratio)
      borderRadius: 12, // Modern curves
      marginRight: 15, // More breathing room between cards
      backgroundColor: "#2a2a2a", // Loading placeholder color

      // Shadow to pop off the screen
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,

      // Important for the image + gradient to clip correctly
      overflow: "hidden",
      position: "relative",
    },
    // THE IMAGE
    image: {
      width: "100%",
      height: "100%",
      borderRadius: 12,
    },
    // THE GRADIENT FADE
    gradientOverlay: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: "60%", // Fades up 60% of the card
      justifyContent: "flex-end",
      paddingHorizontal: 10,
      paddingBottom: 8,
    },
    // TITLE TEXT
    cardTitle: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "700",
      textShadowColor: "rgba(0,0,0,0.75)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
      zIndex: 2,
    },
    // THE PLAY ICON OVERLAY
    playIconContainer: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1,
    },
    playButtonBubble: {
      width: 36, // Slightly bigger
      height: 36,
      borderRadius: 18,
      backgroundColor: "rgba(0,0,0,0.3)", // More transparent
      borderWidth: 1.5,
      borderColor: "rgba(255,255,255,0.8)", // Bright white border
      justifyContent: "center",
      alignItems: "center",
      // Add a glow
      shadowColor: "black",
      shadowOpacity: 0.5,
      shadowRadius: 3,
      elevation: 3,
    },
  });
};
