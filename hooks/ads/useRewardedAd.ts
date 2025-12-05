// src/hooks/useRewardedAd.ts
import { useEffect, useState } from "react";
import {
  RewardedAd,
  RewardedAdEventType,
} from "react-native-google-mobile-ads";
import { getAdUnitId } from "@/utils/adsConfig";

const adUnitId = getAdUnitId("rewarded");

// Singleton instance
let rewarded = RewardedAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

export const useRewardedAd = () => {
  const [loaded, setLoaded] = useState(false);
  const [rewardEarned, setRewardEarned] = useState(false);

  useEffect(() => {
    const loadListener = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
      },
    );

    const rewardListener = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log("User earned reward:", reward);
        setRewardEarned(true);
      },
    );

    const closeListener = rewarded.addAdEventListener(
      RewardedAdEventType.CLOSED,
      () => {
        setLoaded(false);
        // Load the next one
        rewarded.load();
      },
    );

    rewarded.load();

    return () => {
      loadListener();
      rewardListener();
      closeListener();
    };
  }, []);

  const showRewarded = () => {
    if (loaded) {
      setRewardEarned(false); // Reset reward state before showing
      rewarded.show();
    }
  };

  return { loaded, rewardEarned, showRewarded };
};
