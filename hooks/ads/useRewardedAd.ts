import { useEffect, useState, useCallback } from "react";
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
  AdEventType,
} from "react-native-google-mobile-ads";
import { Alert, Platform } from "react-native";
import { supabase } from "@/utils/supabase";
import { useUserStats } from "@/context/UserStatsContext";

// 1. Select ID based on Platform/Dev environment
const adUnitId = __DEV__
  ? TestIds.REWARDED
  : Platform.select({
      ios: "ca-app-pub-xxxxxxxxxxxxx/yyyyyy", // iOS ID
      android: "ca-app-pub-xxxxxxxxxxxxx/zzzzzz", // Android ID
    }) || "";

// 2. Create the instance outside the hook (Singleton pattern)
const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  keywords: ["game", "coins", "spinner"],
});

export const useRewardAd = () => {
  const [loaded, setLoaded] = useState(false);
  const { refreshStats } = useUserStats();

  useEffect(() => {
    // --- EVENT LISTENERS ---

    // A. Ad Loaded Successfully
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        // console.log("Ad Loaded and ready");
        setLoaded(true);
      },
    );

    // B. User Earned Reward
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      async (reward) => {
        console.log("User earned reward:", reward);
        try {
          // Call backend RPC
          const { error } = await supabase.rpc("add_one_spin");
          if (error) throw error;

          Alert.alert("Success!", "You got 1 Free Spin!");
          await refreshStats(); // Update UI
        } catch (e) {
          console.error(e);
          Alert.alert("Error", "Could not save your reward.");
        }
      },
    );

    // C. Ad Closed (Load the next one!)
    const unsubscribeClosed = rewarded.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setLoaded(false);
        rewarded.load(); // Fetch next ad immediately
      },
    );

    // D. ERROR HANDLING (CRITICAL FIX)
    const unsubscribeError = rewarded.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.error("Ad Failed to Load:", error);
        setLoaded(false);
        // Optional: Retry after a delay if it was a network error
      },
    );

    // --- INITIAL LOAD ---
    // Only load if not already loaded to prevent "Ad is already loading" errors
    rewarded.load();

    // Cleanup listeners on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  const showAd = useCallback(() => {
    if (loaded) {
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
      // Try loading again if user clicks and it's not ready
      rewarded.load();
    }
  }, [loaded]);

  return { showAd, isAdLoaded: loaded };
};
