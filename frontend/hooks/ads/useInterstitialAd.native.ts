import { useCallback } from "react";

export const useInterstitialAd = () => {
  // Return dummy state and functions that match what your UI expects
  return {
    isLoaded: false,
    isClosed: false,
    load: useCallback(() => {
      console.log("Web: Rewarded Ad load called (ignored)");
    }, []),
    show: useCallback(() => {
      console.log("Web: Rewarded Ad show called (ignored)");
    }, []),
    error: null,
    reward: null,
  };
};
