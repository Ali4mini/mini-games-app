import { StyleSheet } from "react-native";
import { Theme } from "@/types/index";

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      borderRadius: 12,
      paddingHorizontal: 15,
      marginHorizontal: 20,
      marginTop: 10,
      borderWidth: 1,
      borderColor: theme.card === "#FFFFFF" ? "#E2E8F0" : theme.card,
    },
    icon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      height: 48,
      fontSize: 16,
      color: theme.text,
    },
  });
};
