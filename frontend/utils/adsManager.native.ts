import {
  RewardedAd,
  InterstitialAd,
  AdEventType,
  RewardedAdEventType,
} from "react-native-google-mobile-ads";
import { getAdUnitId } from "./adsConfig";

// --- 1. INSTANCES ---
export const rewardedAd = RewardedAd.createForAdRequest(
  getAdUnitId("rewarded"),
  {
    keywords: ["game", "coins"],
  },
);

export const interstitialAd = InterstitialAd.createForAdRequest(
  getAdUnitId("interstitial"),
  {
    keywords: ["game", "break"],
  },
);

// --- 2. SINGLE SOURCE OF STATE ---
// We keep the state here. Hooks just read this.
export const AdStatus = {
  isRewardedLoaded: false,
  isInterstitialLoaded: false,
};

// --- 3. SUBSCRIPTION SYSTEM ---
// Hooks will subscribe to this to get updates
type AdListener = () => void;
const listeners: Set<AdListener> = new Set();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

export const subscribeToAdStatus = (listener: AdListener) => {
  listeners.add(listener);
  return () => listeners.delete(listener); // Return cleanup function
};

// --- 4. MANAGER LOGIC ---
let isInitialized = false;
let rewardedRetryTimeout: NodeJS.Timeout | null = null;

export const AdManager = {
  initialize: () => {
    if (isInitialized) return;
    isInitialized = true;
    console.log("💎 AdManager: Initializing...");

    // ===========================
    // REWARDED AD EVENTS
    // ===========================

    // 1. LOADED
    rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log("✅ AdManager: Rewarded Loaded");
      AdStatus.isRewardedLoaded = true;
      if (rewardedRetryTimeout) clearTimeout(rewardedRetryTimeout);
      notifyListeners(); // <--- Tell the UI to update
    });

    // 2. CLOSED
    rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
      console.log("♻️ AdManager: Rewarded Closed -> Reloading...");
      AdStatus.isRewardedLoaded = false;
      notifyListeners(); // <--- Tell UI it's not ready
      rewardedAd.load();
    });

    // 3. ERROR (Retry Logic)
    rewardedAd.addAdEventListener(AdEventType.ERROR, (error) => {
      console.warn("❌ AdManager: Rewarded Load Failed", error.message);
      AdStatus.isRewardedLoaded = false;
      notifyListeners();

      if (rewardedRetryTimeout) clearTimeout(rewardedRetryTimeout);
      rewardedRetryTimeout = setTimeout(() => {
        console.log("🔄 AdManager: Retrying...");
        rewardedAd.load();
      }, 3000); // Retry after 3 seconds
    });

    // ===========================
    // INTERSTITIAL (Simplified)
    // ===========================
    interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      AdStatus.isInterstitialLoaded = true;
      notifyListeners();
    });
    interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      AdStatus.isInterstitialLoaded = false;
      notifyListeners();
      interstitialAd.load();
    });
    interstitialAd.addAdEventListener(AdEventType.ERROR, () => {
      AdStatus.isInterstitialLoaded = false;
      notifyListeners();
      // Add interstitial retry logic here if needed
    });

    // START
    rewardedAd.load();
    interstitialAd.load();
  },
};
