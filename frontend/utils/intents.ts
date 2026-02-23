// utils/intents.ts
import { Linking, Platform, Share, Alert } from "react-native";

// ⚠️ IMPORTANT: Change this to your real package name before publishing!
// It must match what you have in app.json and build.gradle
const PACKAGE_NAME = "com.gharaee.mysteryplay";

export type StoreName = "playstore" | "bazaar" | "myket";

/**
 * Opens the specific store page for the user to leave a review.
 * Falls back to the web browser if the store app isn't installed.
 */
export const openStoreForReview = async (storeName: StoreName) => {
  if (Platform.OS !== "android") {
    // If you plan to support iOS later, you can add App Store logic here
    Alert.alert("Notice", "Store ratings are only available on Android.");
    return;
  }

  let appUrl = "";
  let webUrl = "";

  switch (storeName) {
    case "playstore":
      appUrl = `market://details?id=${PACKAGE_NAME}`;
      webUrl = `https://play.google.com/store/apps/details?id=${PACKAGE_NAME}`;
      break;
    case "bazaar":
      // Cafe Bazaar specific intent to open directly to the review section
      appUrl = `bazaar://reviews?id=${PACKAGE_NAME}`;
      webUrl = `https://cafebazaar.ir/app/${PACKAGE_NAME}`;
      break;
    case "myket":
      // Myket specific intent to open directly to the comments/rating section
      appUrl = `myket://comment?id=${PACKAGE_NAME}`;
      webUrl = `https://myket.ir/app/${PACKAGE_NAME}`;
      break;
  }

  try {
    const supported = await Linking.canOpenURL(appUrl);
    if (supported) {
      await Linking.openURL(appUrl);
    } else {
      // Fallback to browser if the user doesn't have the store installed
      await Linking.openURL(webUrl);
    }
  } catch (error) {
    Alert.alert("Error", "Could not open the store.");
    console.error("Store Intent Error:", error);
  }
};

/**
 * Opens the native share sheet to invite friends
 */
export const shareApp = async () => {
  try {
    const message = `Check out this awesome game! Can you beat my high score? \nhttps://play.google.com/store/apps/details?id=${PACKAGE_NAME}`;
    await Share.share({
      message,
    });
  } catch (error: any) {
    console.error("Share Intent Error:", error.message);
  }
};

/**
 * Opens the user's default email client pre-filled with your support email
 */
export const contactSupport = async (
  email: string = "support@yourdomain.com",
) => {
  const subject = encodeURIComponent("MysteryPlay Support Request");
  const body = encodeURIComponent("Please describe your issue here:\n\n");
  const url = `mailto:${email}?subject=${subject}&body=${body}`;

  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        "No Email App",
        `We couldn't find an email app. Please reach out to us at ${email}`,
      );
    }
  } catch (error) {
    console.error("Email Intent Error:", error);
  }
};
