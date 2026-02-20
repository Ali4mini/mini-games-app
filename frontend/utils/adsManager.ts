// AdManager.ts (WEB VERSION)

// 1. MOCK INSTANCES
// We create dummy objects so calling rewardedAd.show() won't crash the app
export const rewardedAd = {
  load: () => {},
  show: () => console.log("AdManager: Rewarded Ads not supported on Web"),
  addAdEventListener: () => {},
};

export const interstitialAd = {
  load: () => {},
  show: () => console.log("AdManager: Interstitial Ads not supported on Web"),
  addAdEventListener: () => {},
};

// 2. STATE
// We explicitly set loaded to false so your UI never tries to show the button
export const AdStatus = {
  isRewardedLoaded: false,
  isInterstitialLoaded: false,
};

// 3. SUBSCRIPTION SYSTEM
// A dummy implementation that accepts a listener and returns a cleanup function
type AdListener = () => void;

export const subscribeToAdStatus = (listener: AdListener) => {
  // On web, state never changes, so we don't need to actually store listeners
  return () => {}; // Return empty cleanup function
};

// 4. MANAGER LOGIC
export const AdManager = {
  initialize: () => {
    console.log("💎 AdManager: Web initialized (Ads Disabled)");
  },
};
