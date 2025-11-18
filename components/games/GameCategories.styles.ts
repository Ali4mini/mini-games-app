import { StyleSheet } from "react-native";
import { Theme } from "@/types";

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      marginTop: 20,
      marginBottom: 10, // Add some space before the game list
    },
    tag: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor:
        theme.backgroundSecondary === "#FFFFFF"
          ? "#E2E8F0"
          : theme.backgroundSecondary,
      backgroundColor: theme.backgroundSecondary,
      marginRight: 10,
    },
    tagActive: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.primary,
      backgroundColor: theme.primary,
      marginRight: 10,
    },
    tagText: {
      color: theme.textSecondary,
      fontWeight: "600",
    },
    tagTextActive: {
      color: "#FFFFFF",
      fontWeight: "600",
    },
  });
};
