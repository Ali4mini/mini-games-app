import { StyleSheet } from "react-native";
import { Theme } from "../types/index";

/**
 * A function that creates our styles object.
 * It takes the theme as an argument to make it dynamic.
 */
export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 10,
    },
    headerWelcome: {
      fontSize: 16,
      color: theme.textSecondary,
    },
    headerUsername: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
    },
    coinsContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    coinsText: {
      fontSize: 18,
      fontWeight: "bold",
      marginLeft: 8,
      color: theme.text,
    },
    heroBanner: {
      marginHorizontal: 20,
      marginTop: 20,
      borderRadius: 15,
      overflow: "hidden",
      height: 180,
      justifyContent: "center",
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },
    heroImage: {
      width: "100%",
      height: "100%",
      position: "absolute",
    },
    heroTextContainer: {
      padding: 20,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      width: "100%",
      height: "100%",
      justifyContent: "flex-end",
    },
    heroTitle: {
      fontSize: 26,
      fontWeight: "bold",
      color: "#FFF",
      marginBottom: 5,
    },
    heroSubtitle: {
      fontSize: 16,
      color: "#FFF",
    },
    quickActionsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingHorizontal: 15,
      marginTop: 20,
    },
    quickAction: {
      backgroundColor: theme.tint,
      paddingVertical: 15,
      paddingHorizontal: 10,
      borderRadius: 15,
      flex: 1,
      marginHorizontal: 5,
      alignItems: "center",
      justifyContent: "center",
      elevation: 2,
    },
    quickActionText: {
      color: "#FFF",
      marginTop: 10,
      fontWeight: "bold",
      fontSize: 14,
    },
    section: {
      marginTop: 30,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
      marginLeft: 20,
      marginBottom: 15,
    },
    gameCard: {
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
    gameImage: {
      width: "100%",
      height: 120,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    gameTitle: {
      padding: 10,
      fontSize: 14,
      fontWeight: "600",
      textAlign: "center",
      color: theme.textSecondary,
    },
    iconImage: {
      width: 24, // Adjust size as needed
      height: 24, // Adjust size as needed
      tintColor: "#FFF", // To match the original white color
    },
    seeAllButton: {
      marginHorizontal: 20,
      marginTop: 20,
      backgroundColor: theme.card,
      paddingVertical: 12,
      borderRadius: 25,
      alignItems: "center",
    },
    seeAllButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.text,
    },
    referralContainer: {
      backgroundColor: theme.background,
      margin: 20,
      borderRadius: 15,
      padding: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: theme.tint,
    },
    referralText: {
      flex: 1,
      marginLeft: 15,
      marginRight: 10,
    },
    referralTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.tint,
    },
    referralSubtitle: {
      fontSize: 14,
      color: theme.tint,
      marginTop: 2,
    },
  });
};
