import { Linking } from "react-native";

const PACKAGE_NAME = "com.test.mysteryplay"; // Make sure this matches your app.json

export const handleRateUs = async () => {
  const store = process.env.EXPO_PUBLIC_STORE;
  console.log("Current Store Build:", store); // DEBUG: Check this in terminal

  let url = "";
  let fallbackWeb = "";

  if (store === "myket") {
    url = `myket://comment?id=${PACKAGE_NAME}`;
    fallbackWeb = `https://myket.ir/app/${PACKAGE_NAME}`;
  } else if (store === "bazaar") {
    url = `bazaar://details?id=${PACKAGE_NAME}`;
    fallbackWeb = `https://cafebazaar.ir/app/${PACKAGE_NAME}`;
  } else {
    url = `market://details?id=${PACKAGE_NAME}`;
    fallbackWeb = `https://play.google.com/store/apps/details?id=${PACKAGE_NAME}`;
  }

  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      // This opens the NATIVE app
      await Linking.openURL(url);
    } else {
      // This opens the BROWSER (only if store app isn't installed)
      console.log("Store app not installed, opening web fallback");
      await Linking.openURL(fallbackWeb);
    }
  } catch (error) {
    console.error("Link error:", error);
    Linking.openURL(fallbackWeb);
  }
};

export const getStoreName = () => {
  if (process.env.EXPO_PUBLIC_STORE === "myket") return "مایکت";
  if (process.env.EXPO_PUBLIC_STORE === "bazaar") return "کافه بازار";
  return "Google Play";
};
