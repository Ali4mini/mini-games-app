import { StyleSheet } from "react-native";
import { Theme } from "@/types";

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: theme.backgroundSecondary,
      borderRadius: 15,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.textPrimary,
      marginBottom: 15,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
    },
    userRow: {
      backgroundColor: theme.backgroundPrimary, // Highlight the user's row
      borderRadius: 10,
      marginTop: 10,
    },
    rank: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.textSecondary,
      width: 40,
      textAlign: "center",
    },
    name: {
      flex: 1,
      fontSize: 16,
      color: theme.textPrimary,
      marginLeft: 10,
    },
    coins: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.buttonSecondary,
    },
  });
};
