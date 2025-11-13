import { StyleSheet } from "react-native";
import { Theme } from "../../types/index";

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      backgroundColor: theme.background,
      alignItems: "center",
      justifyContent: "center",
      borderBottomWidth: 1,
      borderBottomColor: theme.card === "#FFFFFF" ? "#E2E8F0" : theme.card, // Use light gray border in light mode
    },
    title: {
      fontFamily: "LilitaOne", // Use the custom font
      fontSize: 32,
      color: theme.tint, // Use the primary brand color
      letterSpacing: 1.5,
    },
  });
};
