import { StyleSheet } from "react-native";
import { Theme } from "../../types/index";

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    sectionContainer: {
      marginTop: 30,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.textPrimary,
      marginLeft: 20,
      marginBottom: 15,
    },
    // Styles for the smaller, recent game cards
    card: {
      width: 130,
      height: 90,
      borderRadius: 10,
      marginRight: 12,
      overflow: "hidden", // Ensures the image corners are rounded
      justifyContent: "flex-end", // Aligns the textPrimary overlay to the bottom
    },
    image: {
      width: "100%",
      height: "100%",
      position: "absolute",
    },
    textOverlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      paddingVertical: 6,
      paddingHorizontal: 10,
    },
    cardTitle: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "600",
    },
  });
};
