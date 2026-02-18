import React from "react";
import { View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { getAdUnitId } from "@/utils/adsConfig.native"; // Adjust path if needed

const adUnitId = getAdUnitId("banner");

export const SmartBanner = () => {
  return (
    <View style={{ alignItems: "center", marginVertical: 15 }}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={(error) =>
          console.error("Ad failed to load: ", error)
        }
      />
    </View>
  );
};
