import { StyleSheet } from "react-native";
import { Theme } from "@/types";

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    section: {
      marginTop: 30,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.textPrimary,
      paddingHorizontal: 20,
      marginBottom: 15,
    },
  });
