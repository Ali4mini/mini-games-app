import { StyleSheet } from "react-native";
import { Theme } from "../../types/index";

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
      borderColor: theme.card === "#FFFFFF" ? "#E2E8F0" : theme.card,
      backgroundColor: theme.card,
      marginRight: 10,
    },
    tagActive: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.tint,
      backgroundColor: theme.tint,
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
