import { StyleSheet } from "react-native";
import { Theme } from "../../types/index";

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    card: {
      width: 120,
      marginRight: 15,
      borderRadius: 10,
      backgroundColor: theme.card,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    image: {
      width: "100%",
      height: 120,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    title: {
      padding: 10,
      fontSize: 14,
      fontWeight: "600",
      textAlign: "center",
      color: theme.textSecondary,
    },
  });
};
