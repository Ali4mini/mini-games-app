import { StyleSheet } from "react-native";
import { Theme } from "@/types";

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundPrimary,
    },
    scrollViewContent: {
      padding: 20,
      paddingBottom: 110, // For the tab bar
    },
    // Identity Section
    identitySection: {
      alignItems: "center",
      marginBottom: 30,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 15,
      borderWidth: 3,
      borderColor: theme.primary,
    },
    username: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.textPrimary,
    },
    coinsContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
    },
    coinsText: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.buttonPrimary,
      marginLeft: 8,
    },
    joinDate: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 8,
    },
    // Referral Section
    referralSection: {
      backgroundColor: theme.backgroundSecondary,
      borderRadius: 15,
      padding: 20,
      marginBottom: 30,
    },
    referralTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.textSecondary,
      textAlign: "center",
      marginBottom: 15,
    },
    referralBox: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.backgroundPrimary,
      borderRadius: 10,
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: theme.textSecondary,
      paddingHorizontal: 15,
      paddingVertical: 12,
    },
    referralCodeText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.textPrimary,
      letterSpacing: 1,
    },
    copyButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 8,
    },
    copyButtonText: {
      color: theme.primaryContent,
      fontWeight: "bold",
    },
  headerRow: {
    flexDirection: "row", // Aligns items horizontally
    justifyContent: "space-between", // Pushes items to the right
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 10,
    zIndex: 10, // Ensures the dropdown/modal trigger sits above other content if needed
  },
  });
};
