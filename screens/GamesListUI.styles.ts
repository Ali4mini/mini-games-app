import { StyleSheet, Dimensions } from "react-native";
import { Theme } from "@/types";

const { width } = Dimensions.get("window");
const GAP = 15;
const PADDING = 20;
// Calculate precise card width for 2-column grid
const ITEM_WIDTH = (width - (PADDING * 2) - GAP) / 2;

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundPrimary,
    },
    
    // --- Header ---
    headerContainer: {
      paddingHorizontal: PADDING,
      paddingTop: 10,
      paddingBottom: 5,
    },
    pageTitle: {
      fontSize: 28,
      fontWeight: "800",
      color: theme.textPrimary,
      marginBottom: 15,
      letterSpacing: 0.5,
    },

    // --- Grid Layout ---
    listContentContainer: {
      paddingHorizontal: PADDING,
      paddingBottom: 100, // Space for bottom tab bar
      paddingTop: 10,
    },
    columnWrapper: {
      justifyContent: "space-between",
      marginBottom: 20,
    },

    // --- Empty State ---
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 50,
      opacity: 0.7,
    },
    emptyText: {
      marginTop: 10,
      fontSize: 16,
      fontStyle: "italic",
    },

    // --- Card Styles (Same as FeaturedGames) ---
    cardContainer: {
      width: ITEM_WIDTH,
      backgroundColor: theme.backgroundSecondary, // Card color (White/Slate)
      borderRadius: 16,
      // Subtle Shadow
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    imageWrapper: {
      width: "100%",
      height: ITEM_WIDTH * 1.1, // Portrait aspect ratio
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      overflow: "hidden",
      position: "relative",
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
      gap: 4,
    },
    ratingText: {
      color: "#FFFFFF",
      fontSize: 10,
      fontWeight: "bold",
    },

    // --- Info Section ---
    infoWrapper: {
      padding: 12,
      paddingTop: 16,
      position: "relative",
    },
    gameTitle: {
      color: theme.textPrimary,
      fontSize: 13,
      fontWeight: "700",
      marginBottom: 4,
    },
    gameCategory: {
      color: theme.textTertiary,
      fontSize: 11,
      fontWeight: "500",
    },

    // --- Floating Play Button ---
    playBtn: {
      position: "absolute",
      top: -18,
      right: 10,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.secondary, // Cyan Pop Color
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      borderColor: theme.backgroundSecondary, // "Cutout" effect from card bg
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 4,
    },
  });
