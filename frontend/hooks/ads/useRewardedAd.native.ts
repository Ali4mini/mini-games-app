import { useEffect, useState, useCallback, useRef } from "react";
import { RewardedAdEventType } from "react-native-google-mobile-ads";
import { Alert } from "react-native";
import { useUserStats } from "@/context/UserStatsContext";
// Import the Subscription function
import { rewardedAd, AdStatus, subscribeToAdStatus } from "@/utils/adsManager";

export const useRewardAd = () => {
  // 1. Initialize state from the singleton
  const [loaded, setLoaded] = useState(AdStatus.isRewardedLoaded);

  const { refreshStats } = useUserStats();
  const onRewardEarnedRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    // --- A. SUBSCRIBE TO MANAGER STATE ---
    // This guarantees the hook stays in sync with the Manager,
    // even if the ad reloaded while this component was unmounted/inactive.
    const unsubscribeFromManager = subscribeToAdStatus(() => {
      setLoaded(AdStatus.isRewardedLoaded);
    });

    // --- B. HANDLE REWARD EVENT ---
    // We still listen to this directly because we need to trigger the callback
    const unsubscribeEarned = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      async () => {
        if (onRewardEarnedRef.current) {
          try {
            await onRewardEarnedRef.current();
            await refreshStats();
          } catch (e) {
            console.error("Reward execution failed", e);
          }
        }
        onRewardEarnedRef.current = null;
      },
    );

    // Initial Sync (Just in case state changed before effect ran)
    setLoaded(AdStatus.isRewardedLoaded);

    return () => {
      unsubscribeFromManager();
      unsubscribeEarned();
    };
  }, []);

  const showAd = useCallback(
    (onReward?: () => Promise<void>) => {
      if (loaded) {
        if (onReward) onRewardEarnedRef.current = onReward;
        try {
          rewardedAd.show();
        } catch (e) {
          console.error("Show failed", e);
          // If show fails, Manager will likely catch Error event and update state
          setLoaded(false);
        }
      } else {
        Alert.alert("Ad Loading", "Please wait for the video to load.");
      }
    },
    [loaded],
  );

  return { showAd, isAdLoaded: loaded };
};
