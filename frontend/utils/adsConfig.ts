// utils/adsConfig.ts (WEB VERSION)

// 🛑 DO NOT IMPORT "react-native-google-mobile-ads" HERE!
// It will crash the web build immediately.

export const getAdUnitId = (
  type: "banner" | "interstitial" | "rewarded" | "native",
) => {
  // Return an empty string or a dummy value for web.
  // We don't need real IDs because we aren't loading ads.
  return "";
};
