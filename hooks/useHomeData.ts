import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase";
import { UserProfile, HeroBannerItem, Game } from "@/types";
import { Alert } from "react-native";

export const useHomeData = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [banners, setBanners] = useState<HeroBannerItem[]>([]);
  const [games, setGames] = useState<Game[]>([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Get Current User Session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Handle unauthenticated state (redirect to login usually handled by a wrapper)
        setLoading(false);
        return;
      }

      const userId = session.user.id;

      // 2. Fetch User Profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;

      // 3. Fetch Active Banners
      const { data: bannerData, error: bannerError } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true);

      if (bannerError) throw bannerError;

      // 4. Fetch Games (For "Continue Playing" or "Featured")
      // Note: For true "Recently Played", you would need a game_history table.
      // For now, we fetch a few active games.
      const { data: gamesData, error: gamesError } = await supabase
        .from("games")
        .select("*")
        .limit(5);

      if (gamesError) throw gamesError;

      // Set State
      setProfile({
        id: profileData.id,
        username: profileData.username,
        // Fallback for name if it's null in DB
        name: profileData.name || profileData.username || "Player",
        avatar: profileData.avatar_url || "https://via.placeholder.com/150",
        coins: profileData.coins,
        joinDate: profileData.created_at,
        level: profileData.level,
        referralCode: profileData.referral_code,
      } as unknown as UserProfile); // Type assertion to match your specific UserProfile interface

      setBanners(bannerData as HeroBannerItem[]);
      setGames(gamesData as Game[]);
    } catch (error: any) {
      console.error("Error fetching home data:", error.message);
      Alert.alert("Error", "Could not load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial Fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // OPTIONAL: Real-time Coin Updates
  useEffect(() => {
    const subscription = supabase
      .channel("public:profiles")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles" },
        (payload) => {
          // If the update is for the current user, update their coins in state
          if (profile && payload.new.id === profile.id) {
            setProfile((prev) =>
              prev ? { ...prev, coins: payload.new.coins } : null,
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [profile?.id]);

  return { loading, profile, banners, games, refetch: fetchData };
};
