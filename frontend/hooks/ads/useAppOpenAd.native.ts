// hooks/ads/useAppOpenAd.native.ts
import { useEffect, useState, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { AppOpenAd, AdEventType } from "react-native-google-mobile-ads";
import { getAdUnitId } from "@/utils/adsConfig"; // Removes .native extension so strict mode is happy

// Initialize the ad instance outside the hook to persist it
const appOpenAd = AppOpenAd.createForAdRequest(getAdUnitId("appOpen"), {
  requestNonPersonalizedAdsOnly: true,
});

export const useAppOpenAd = () => {
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const isShowingAd = useRef(false);

  useEffect(() => {
    // 1. Event: Ad Loaded
    const loadListener = appOpenAd.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setIsAdLoaded(true);
      },
    );

    // 2. Event: Ad Closed -> Load the next one
    const closeListener = appOpenAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setIsAdLoaded(false);
        isShowingAd.current = false;
        appOpenAd.load();
      },
    );

    // 3. Event: Ad Opened (Mark as showing)
    const openListener = appOpenAd.addAdEventListener(
      AdEventType.OPENED,
      () => {
        isShowingAd.current = true;
      },
    );

    // 4. App State Listener (Background -> Foreground)
    const appStateListener = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (nextAppState === "active" && isAdLoaded && !isShowingAd.current) {
          // Show ad when returning to app (if ready)
          try {
            appOpenAd.show();
          } catch (e) {
            console.error("Failed to show App Open Ad", e);
          }
        }
      },
    );

    // Initial Load
    appOpenAd.load();

    return () => {
      loadListener();
      closeListener();
      openListener();
      appStateListener.remove();
    };
  }, [isAdLoaded]);
};
