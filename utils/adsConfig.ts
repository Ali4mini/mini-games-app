// adsConfig.ts
import { TestIds } from "react-native-google-mobile-ads";

// 1. Define your Real Ad Unit IDs (from AdMob Console)
const productionIDs = {
  banner: "ca-app-pub-7396391927360129/6787475011",
  interstitial: "ca-app-pub-7396391927360129/9372549405",
  rewarded: "ca-app-pub-7396391927360129/2396077512",
  appOpen: "ca-app-pub-7396391927360129/7581681937",
};

// 2. Export a function that returns the safe ID
export const getAdUnitId = (type: "banner" | "interstitial" | "rewarded") => {
  // IF we are in development, return Google's Test ID
  if (__DEV__) {
    switch (type) {
      case "banner":
        return TestIds.BANNER;
      case "interstitial":
        return TestIds.INTERSTITIAL;
      case "rewarded":
        return TestIds.REWARDED;
      default:
        return TestIds.BANNER;
    }
  }

  // IF we are in production, return the Real ID
  return productionIDs[type];
};
