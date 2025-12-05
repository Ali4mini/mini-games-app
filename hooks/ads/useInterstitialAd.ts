import { useEffect, useState } from "react";
import { InterstitialAd, AdEventType } from "react-native-google-mobile-ads";
import { getAdUnitId } from "@/utils/adsConfig";

const adUnitId = getAdUnitId("interstitial");

// Define outside component to persist across re-renders
let interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

export const useInterstitialAd = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadListener = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
      },
    );

    const closeListener = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setLoaded(false);
        interstitial.load(); // Auto-load the next one
      },
    );

    // Load immediately if not loaded
    if (!loaded) interstitial.load();

    return () => {
      loadListener();
      closeListener();
    };
  }, []);

  const showInterstitial = () => {
    if (loaded) {
      interstitial.show();
    }
  };

  return { showInterstitial, loaded };
};
