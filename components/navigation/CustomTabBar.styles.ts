import { StyleSheet } from "react-native";
import { Theme } from "@/types/index";

export const createStyles = (theme: Theme, bottomInset: number) => {
  return StyleSheet.create({
    tabBarContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 70 + bottomInset, // Total height including safe area
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "flex-start",
      paddingBottom: bottomInset,
      // Shadow
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 10,
    },
    tabButton: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      top: 10, // Push buttons down slightly from the top edge
    },
    centerButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.accentButton,
      top: -38,
      // Shadow for the center button
      shadowColor: theme.accentButton,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 8,
    },
    activeSideButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.tint, // White background for active side button
      justifyContent: "center",
      alignItems: "center",
    },
  });
};
