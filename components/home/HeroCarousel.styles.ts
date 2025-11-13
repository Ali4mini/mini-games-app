import { StyleSheet } from "react-native";
import { Theme } from "../../types/index";

export const createStyles = (theme: Theme, width: number) => {
  return StyleSheet.create({
    container: {
      height: 180,
      marginTop: 20,
    },
    slide: {
      flex: 1,
      marginHorizontal: 20,
      borderRadius: 15,
      overflow: "hidden",
      justifyContent: "center",
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      width: width - 40, // Screen width minus horizontal margins
    },
    image: {
      width: "100%",
      height: "100%",
      position: "absolute",
    },
    textOverlay: {
      padding: 20,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      width: "100%",
      height: "100%",
      justifyContent: "flex-end",
    },
    title: {
      fontSize: 26,
      fontWeight: "bold",
      color: "#FFF",
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 16,
      color: "#FFF",
    },
  });
};
