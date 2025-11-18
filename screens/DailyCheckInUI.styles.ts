import { StyleSheet } from "react-native";
import { Theme } from "@/types";

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundPrimary,
      justifyContent: "space-between",
      padding: 20,
    },
    header: {
      alignItems: "center",
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
    // New container to center the grid vertically
    gridContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    daysGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 16,
      maxWidth: "100%",
      width: "100%",
      paddingHorizontal: 10, // Add padding to prevent edge clipping
    },
    dayCell: {
      width: "30%", // Use percentage instead of fixed width
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
    },
    dayCellClaimed: {
      backgroundColor: theme.primary,
    },
    dayCellFuture: {
      opacity: 0.5,
    },
    dayCellGrandPrize: {
      borderColor: theme.buttonSecondary,
      borderWidth: 2,
      width: "60%",
      aspectRatio: 0.9,
    },
    dayText: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.textSecondary,
    },
    dayTextClaimed: {
      color: theme.primaryContent,
    },
    rewardText: {
      fontSize: 20,
      fontWeight: "bold",
      marginTop: 8,
      color: theme.buttonSecondary,
    },
    rewardTextClaimed: {
      color: theme.primaryContent,
    },
    buttonContainer: {
      paddingBottom: 120,
    },
    gradient: {
      paddingVertical: 15,
      paddingHorizontal: 60,
      borderRadius: 30,
      alignItems: "center",
    },
    buttonDisabled: {
      backgroundColor: theme.textSecondary,
      borderRadius: 30,
    },
    buttonDisabledText: {
      color: theme.secondaryContent,
      fontSize: 20,
      fontWeight: "bold",
    },
    buttonText: {
      color: theme.secondaryContent,
      fontSize: 20,
      fontWeight: "bold",
      letterSpacing: 1,
    },
    progressBarContainer: {
      width: "90%",
      marginBottom: 40,
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
      height: 8,
      borderRadius: 4,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      borderRadius: 4,
    },
  });
};
