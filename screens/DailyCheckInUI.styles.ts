import { StyleSheet } from "react-native";
import { Theme } from "@/types";

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: "space-between",
      padding: 20,
    },
    header: {
      alignItems: "center",
    },
    title: {
      fontSize: 32,
      fontFamily: "LilitaOne",
      color: theme.text,
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
      backgroundColor: theme.card,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: "transparent",
    },
    dayCellToday: {
      borderColor: theme.accentButton,
      shadowColor: theme.accentButton,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 10,
    },
    dayCellClaimed: {
      backgroundColor: theme.tint,
    },
    dayCellFuture: {
      opacity: 0.5,
    },
    dayCellGrandPrize: {
      borderColor: theme.accentButton,
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
      color: theme.tintContent,
    },
    rewardText: {
      fontSize: 20,
      fontWeight: "bold",
      marginTop: 8,
      color: theme.accentButton,
    },
    rewardTextClaimed: {
      color: theme.tintContent,
    },
    buttonContainer: {
      paddingBottom: 90,
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
    buttonText: {
      color: theme.tintContent,
      fontSize: 20,
      fontWeight: "bold",
      letterSpacing: 1,
    },
  });
};
