// adsConfig.ts
import { TestIds } from "react-native-google-mobile-ads";

const productionIDs = {
  banner: "ca-app-pub-7396391927360129/6787475011",
  interstitial: "ca-app-pub-7396391927360129/9372549405",
  rewarded: "ca-app-pub-7396391927360129/2396077512",
  appOpen: "ca-app-pub-7396391927360129/7581681937",
  native: "ca-app-pub-7396391927360129/xxxxxxxxxx", // <--- Add your Real Native ID here
};

export const getAdUnitId = (
  type: "banner" | "interstitial" | "rewarded" | "native",
) => {
  if (__DEV__) {
    switch (type) {
      case "banner":
        return TestIds.BANNER;
      case "interstitial":
        return TestIds.INTERSTITIAL;
      case "rewarded":
        return TestIds.REWARDED;
      case "native":
        return TestIds.NATIVE; // <--- Google's Native Test ID
      default:
        return TestIds.BANNER;
    }
  }
  return productionIDs[type];
};
