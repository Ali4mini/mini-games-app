// utils/storeUtils.ts
//
import { Linking, Platform } from "react-native";
import * as Application from "expo-application"; // If using Expo

const PACKAGE_NAME = Application.applicationId || "com.mysteryplay.fun"; // Your App ID

// Change this manually before building, OR use an environment variable
// Options: "google" | "bazaar" | "myket"
const TARGET_STORE: "myket" | "bazar" | "google" = "bazar";

export const openStorePage = async () => {
  let url = "";

  if (Platform.OS === "ios") {
    // iOS logic (App Store)
    url = `https://apps.apple.com/app/idYOUR_APP_ID`;
  } else {
    // Android Logic
    switch (TARGET_STORE) {
      case "bazaar":
        // Cafe Bazaar URI Scheme
        url = `bazaar://details?id=${PACKAGE_NAME}`;
        break;
      case "myket":
        // Myket URI Scheme
        url = `myket://details?id=${PACKAGE_NAME}`;
        break;
      default:
        // Fallback (Google Play) - ONLY use this for the Google Play build
        url = `market://details?id=${PACKAGE_NAME}`;
        break;
    }
  }

  // Check if the store app is installed, otherwise open web
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  } else {
    // Fallback Web URLs (Store reviewers prefer the native URI scheme,
    // but this prevents crashes if the store app isn't installed)
    if (TARGET_STORE === "bazaar") {
      await Linking.openURL(`https://cafebazaar.ir/app/${PACKAGE_NAME}`);
    } else if (TARGET_STORE === "myket") {
      await Linking.openURL(`https://myket.ir/app/${PACKAGE_NAME}`);
    } else {
      await Linking.openURL(
        `https://play.google.com/store/apps/details?id=${PACKAGE_NAME}`,
      );
    }
  }
};
