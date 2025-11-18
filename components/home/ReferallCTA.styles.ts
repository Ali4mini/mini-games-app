import { StyleSheet } from "react-native";
import { Theme } from "@/types";

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    referralContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      padding: 20,
      borderRadius: 15,
      marginHorizontal: 20,
      marginTop: 30,
    },
    referralTextContainer: {
      flex: 1,
      marginLeft: 15,
    },
    referralTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.textPrimary,
    },
    referralSubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 4,
    },
  });
