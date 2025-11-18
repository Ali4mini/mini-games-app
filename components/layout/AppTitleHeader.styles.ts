import { StyleSheet } from "react-native";
import { Theme } from "../../types/index";

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      backgroundColor: theme.backgroundPrimary,
      alignItems: "center",
      justifyContent: "center",
      borderBottomWidth: 1,
      borderBottomColor:
        theme.backgroundSecondary === "#FFFFFF"
          ? "#E2E8F0"
          : theme.backgroundSecondary, // Use light gray border in light mode
    },
    title: {
      fontFamily: "LilitaOne", // Use the custom font
      fontSize: 32,
      color: theme.primary, // Use the primary brand color
      letterSpacing: 1.5,
    },
  });
};
