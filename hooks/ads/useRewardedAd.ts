import { useEffect, useState, useCallback, useRef } from "react";
import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
} from "react-native-google-mobile-ads";
import { Alert } from "react-native";
import { useUserStats } from "@/context/UserStatsContext";
import { getAdUnitId } from "@/utils/adsConfig"; // Adjust path if needed

// 1. Select ID using your helper
const adUnitId = getAdUnitId("rewarded");

// 2. Singleton Instance
const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  keywords: ["game", "coins", "spinner"],
});

export const useRewardAd = () => {
  const [loaded, setLoaded] = useState(false);
  const { refreshStats } = useUserStats();

  // Ref to store the SPECIFIC action to run when reward is received
  const onRewardEarnedRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    // --- EVENT LISTENERS ---

    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
      },
    );

    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      async (reward) => {
        console.log("User earned reward:", reward);

        // EXECUTE THE DYNAMIC CALLBACK
        if (onRewardEarnedRef.current) {
          try {
            await onRewardEarnedRef.current(); // Run the specific logic passed from UI
            await refreshStats(); // Force refresh context
          } catch (e) {
            console.error("Error executing reward callback", e);
            Alert.alert("Error", "There was an issue saving your reward.");
          }
        }

        // Reset the callback
        onRewardEarnedRef.current = null;
      },
    );

    const unsubscribeClosed = rewarded.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setLoaded(false);
        onRewardEarnedRef.current = null; // Cleanup
        rewarded.load(); // Load next one immediately
      },
    );

    const unsubscribeError = rewarded.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.error("Ad Failed to Load:", error);
        setLoaded(false);
      },
    );

    // Initial Load
    rewarded.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  // showAd accepts an optional callback function (e.g. for spins vs coins)
  const showAd = useCallback(
    (onReward?: () => Promise<void>) => {
      if (loaded) {
        if (onReward) {
          onRewardEarnedRef.current = onReward;
        }
        try {
          rewarded.show();
        } catch (error) {
          console.error("Ad failed to show:", error);
          setLoaded(false);
          rewarded.load();
        }
      } else {
        Alert.alert(
          "Ad not ready",
          "We are loading a video for you. Please try again in a few seconds.",
        );
        // Try loading again if it failed previously
        rewarded.load();
      }
    },
    [loaded],
  );

  return { showAd, isAdLoaded: loaded };
};
