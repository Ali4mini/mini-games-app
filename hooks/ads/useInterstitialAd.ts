// Mock for Web to prevent crashes
export const useInterstitialAd = (adUnitId: string, options?: any) => {
  return {
    isLoaded: false,
    isClosed: false,
    load: () => console.log("Web: Interstitial load (ignored)"),
    show: () => console.log("Web: Interstitial show (ignored)"),
    error: null,
  };
};
