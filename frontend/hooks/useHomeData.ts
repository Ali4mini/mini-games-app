import { useState, useEffect, useCallback } from "react";
import { pb } from "@/utils/pocketbase";
import { UserProfile, HeroBannerItem, Game } from "@/types";
import { Alert } from "react-native";
import { getStorageUrl } from "@/utils/imageHelpers";

export const useHomeData = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [banners, setBanners] = useState<HeroBannerItem[]>([]);
  const [games, setGames] = useState<Game[]>([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Get Current User from AuthStore
      if (!pb.authStore.isValid || !pb.authStore.model) {
        setLoading(false);
        return;
      }

      const userId = pb.authStore.model.id;

      // 2. Fetch User Profile, Banners, and Games in parallel
      const [profileData, bannerData, gamesData] = await Promise.all([
        pb.collection("users").getOne(userId),
        pb.collection("banners").getFullList({
          filter: "is_active = true",
        }),
        pb.collection("games").getList(1, 5),
      ]);

      // 3. Map Profile State
      setProfile({
        id: profileData.id,
        username: profileData.username,
        name: profileData.name || profileData.username || "Player",
        // PocketBase uses the record + filename to generate the URL
        avatar_url: getStorageUrl(profileData, profileData.avatar_url),
        coins: profileData.coins,
        joinDate: profileData.created,
        level: profileData.level,
        referralCode: profileData.referral_code,
      } as unknown as UserProfile);

      // 4. Map Banners and Games
      // Note: If banners/games have images, you'd apply getStorageUrl to them too
      setBanners(bannerData as unknown as HeroBannerItem[]);
      setGames(gamesData.items as unknown as Game[]);
    } catch (error: any) {
      console.error("Error fetching home data:", error);
      // Only alert if it's not a cancellation error
      if (!error.isAbort) {
        Alert.alert("Error", "Could not load data.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time Updates
  useEffect(() => {
    if (!pb.authStore.model?.id) return;

    // Subscribe to the specific user record
    pb.collection("users").subscribe(pb.authStore.model.id, (e) => {
      if (e.action === "update") {
        setProfile((prev) =>
          prev ? { ...prev, coins: e.record.coins } : null,
        );
      }
    });

    return () => {
      pb.collection("users").unsubscribe(pb.authStore.model?.id);
    };
  }, [pb.authStore.model?.id]);

  return { loading, profile, banners, games, refetch: fetchData };
};
