import { StyleSheet } from "react-native";
import { Theme } from "@/types/index";

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    listContentContainer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    columnWrapper: {
      justifyContent: "space-between", // This creates space between the two columns
      marginBottom: 20, // This creates space between the rows
    },
    gameCardContainer: {
      width: "48%", // A bit less than 50% to allow for space between
    },
  });
};
