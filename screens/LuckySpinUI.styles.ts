// LuckySpinUI.styles.ts
import { StyleSheet } from "react-native";
import { Theme } from "@/types";

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 20,
    },
    safeArea: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 10,
    },
    wheelContainer: {
      position: "relative",
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 20,
    },
    pointer: {
      position: "absolute",
      top: -30,
      alignSelf: "center",
      zIndex: 10,
      transform: [{ translateY: 10 }],
    },
    infoContainer: {
      width: "100%",
      alignItems: "center",
      paddingHorizontal: 20,
      marginBottom: 90,
      paddingTop: 10,
    },
    spinsLeftText: {
      fontSize: 16,
      color: theme.text,
      marginBottom: 5,
    },
    countdownText: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: "center",
    },
  });
};
