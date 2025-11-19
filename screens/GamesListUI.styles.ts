import { StyleSheet, Dimensions } from "react-native";
import { Theme } from "@/types";

const { width } = Dimensions.get("window");
const GAP = 15;
const PADDING = 20;
// Calculate item width: (Screen - LeftPad - RightPad - MiddleGap) / 2
const ITEM_WIDTH = (width - PADDING * 2 - GAP) / 2;

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundPrimary,
    },
    // --- HEADER ---
    headerContainer: {
      paddingHorizontal: PADDING,
      paddingTop: 10,
      backgroundColor: theme.backgroundPrimary, // Ensures header isn't transparent
      zIndex: 10,
    },
    pageTitle: {
      fontSize: 24,
      fontWeight: "800",
      color: theme.textPrimary,
      marginBottom: 15,
      letterSpacing: 0.5,
    },

    // --- GRID ---
    listContentContainer: {
      paddingHorizontal: PADDING,
      paddingTop: 10,
      paddingBottom: 100, // Space for bottom tab bar
    },
    columnWrapper: {
      justifyContent: "space-between",
      marginBottom: 20,
    },
    emptyState: {
      alignItems: "center",
      marginTop: 50,
    },

    // --- POSTER CARD STYLES ---
    cardContainer: {
      width: ITEM_WIDTH,
      backgroundColor: "#252525",
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    imageWrapper: {
      width: "100%",
      height: ITEM_WIDTH * 1.2, // 1.2 aspect ratio = Portrait Poster
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      overflow: "hidden",
      position: "relative",
      backgroundColor: "#333",
    },
    gameImage: {
      width: "100%",
      height: "100%",
    },
    ratingBadge: {
      position: "absolute",
      top: 8,
      left: 8,
      backgroundColor: "rgba(0,0,0,0.6)",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 6,
      gap: 3,
    },
    ratingText: {
      color: "#fff",
      fontSize: 10,
      fontWeight: "bold",
    },
    infoWrapper: {
      padding: 10,
      paddingTop: 15,
      position: "relative",
    },
    playBtn: {
      position: "absolute",
      top: -18, // Floats between image and text
      right: 10,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.primary, // Gold/Pink
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      borderColor: "#252525",
    },
    gameTitle: {
      color: "#fff",
      fontSize: 13,
      fontWeight: "700",
      marginBottom: 2,
    },
    gameCategory: {
      color: "#888",
      fontSize: 11,
    },
  });
};
