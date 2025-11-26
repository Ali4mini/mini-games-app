import { StyleSheet, Dimensions } from "react-native";
import { Theme } from "@/types";

const { width } = Dimensions.get("window");

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundPrimary,
      // Removed justifyContent: 'space-between' to stop overlapping
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 150, // Extra padding at bottom so grid doesn't hide behind button
    },
    header: {
      alignItems: "center",
      marginBottom: 20,
    },
    title: {
      fontSize: 32,
      fontFamily: "LilitaOne",
      color: theme.textPrimary,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: "center",
      marginBottom: 30,
      fontWeight: "500",
      lineHeight: 24,
      maxWidth: "90%",
    },
    gridContainer: {
      // Removed flex: 1 to allow ScrollView to calculate height
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    daysGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between", // Better spacing than 'center' for grids
      gap: 12, // Reduced gap slightly
      width: "100%",
    },
    dayCell: {
      width: "30%", // 3 items per row
      aspectRatio: 1,
      borderRadius: 15,
      backgroundColor: theme.backgroundSecondary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: "transparent",
    },
    dayCellToday: {
      borderColor: theme.buttonSecondary,
      shadowColor: theme.buttonSecondary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 10,
      backgroundColor: theme.backgroundPrimary, // Highlight slightly
    },
    dayCellClaimed: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    dayCellFuture: {
      opacity: 0.5,
    },
    dayCellGrandPrize: {
      width: "100%", // Make grand prize take full width of bottom row
      aspectRatio: 2.5, // Less tall, more wide
      borderColor: theme.buttonSecondary,
      borderWidth: 2,
      marginTop: 5,
    },
    dayText: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.textSecondary,
    },
    dayTextClaimed: {
      color: theme.primaryContent,
    },
    rewardText: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 4,
      color: theme.buttonSecondary,
    },
    rewardTextClaimed: {
      color: theme.primaryContent,
    },
    // Footer styles for the fixed button
    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: 20,
      backgroundColor: theme.backgroundPrimary, // Solid background to cover scrolling content
      borderTopWidth: 1,
      borderTopColor: "rgba(0,0,0,0.05)",
    },
    gradient: {
      paddingVertical: 15,
      borderRadius: 30,
      alignItems: "center",
      width: "100%",
    },
    buttonDisabled: {
      backgroundColor: theme.textSecondary,
    },
    buttonDisabledText: {
      color: theme.secondaryContent,
      fontSize: 18,
      fontWeight: "bold",
    },
    buttonText: {
      color: theme.secondaryContent,
      fontSize: 20,
      fontWeight: "bold",
      letterSpacing: 1,
    },
    progressBarContainer: {
      width: "100%",
      marginBottom: 10,
    },
    progressBarHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    progressText: {
      fontSize: 14,
      color: theme.textSecondary,
      fontWeight: "500",
    },
    progressPercentage: {
      fontSize: 14,
      color: theme.buttonSecondary,
      fontWeight: "bold",
    },
    progressBarBackground: {
      height: 10,
      borderRadius: 5,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      borderRadius: 5,
    },
  });
};
