import { useEffect, useState, useCallback } from "react";
import { AdEventType } from "react-native-google-mobile-ads";
import { interstitialAd, AdStatus } from "@/utils/adsManager"; // Import from Manager

export const useInterstitialAd = () => {
  // 1. Initialize with global status (in case it loaded before this screen mounted)
  const [loaded, setLoaded] = useState(AdStatus.isInterstitialLoaded);

  useEffect(() => {
    // --- EVENT LISTENERS (UI SYNC ONLY) ---
    // The AdManager handles the actual auto-reloading logic.
    // We just listen here to update the 'loaded' boolean for the UI.

    const unsubscribeLoaded = interstitialAd.addAdEventListener(
      AdEventType.LOADED,
      () => setLoaded(true),
    );

    const unsubscribeClosed = interstitialAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setLoaded(false);
        // Note: We do NOT call interstitialAd.load() here.
        // AdManager.ts handles the auto-reload globally.
      },
    );

    const unsubscribeError = interstitialAd.addAdEventListener(
      AdEventType.ERROR,
      () => setLoaded(false),
    );

    // Safety check: Ensure it's loading if manager missed it
    if (!AdStatus.isInterstitialLoaded) {
      interstitialAd.load();
    }

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  const showInterstitial = useCallback(() => {
    if (loaded) {
      try {
        interstitialAd.show();
      } catch (error) {
        console.error("Interstitial failed to show:", error);
        setLoaded(false);
        interstitialAd.load(); // Force reload if show failed
      }
    } else {
      console.log("Interstitial not ready yet");
    }
  }, [loaded]);

  return { showInterstitial, isLoaded: loaded };
};
