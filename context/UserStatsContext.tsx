import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { useAuth } from "./AuthContext";

type UserStats = {
  coins: number;
  avatar: string;
  name: string;
  spinsLeft: number;
};

type UserStatsContextType = {
  stats: UserStats;
  loading: boolean;
  refreshStats: () => Promise<void>;
};

const UserStatsContext = createContext<UserStatsContextType>({
  stats: { coins: 0, avatar: "", name: "", spinsLeft: 0 },
  loading: true,
  refreshStats: async () => {},
});

export const useUserStats = () => useContext(UserStatsContext);

export const UserStatsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { session } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    coins: 0,
    avatar: "https://via.placeholder.com/150",
    name: "Guest",
    spinsLeft: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    if (!session?.user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("coins, avatar_url, name, username, daily_spins_left")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;

      // Handle the Avatar URL logic here centrally
      let avatarUrl = data.avatar_url;
      if (avatarUrl && !avatarUrl.startsWith("http")) {
        const { data: storageData } = supabase.storage
          .from("assets")
          .getPublicUrl(avatarUrl);
        avatarUrl = storageData.publicUrl;
      }

      setStats({
        coins: data.coins,
        avatar: avatarUrl || "https://via.placeholder.com/150",
        name: data.name || data.username || "Player",
        spinsLeft: data.daily_spins_left ?? 0,
      });
    } catch (err) {
      console.error("Error fetching user stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session) return;

    // 1. Initial Fetch
    fetchStats();

    // 2. Realtime Subscription
    // This listens for ANY update to the user's row in the profiles table
    const channel = supabase
      .channel("realtime-stats")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${session.user.id}`, // Only listen to MY updates
        },
        (payload) => {
          console.log("Realtime update received!", payload.new);

          // Optimistically update the state
          setStats((prev) => ({
            ...prev,
            coins: payload.new.coins,
            spinsLeft: payload.new.daily_spins_left,
            // If name/avatar changed, update those too
            name: payload.new.name || prev.name,
          }));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  return (
    <UserStatsContext.Provider
      value={{ stats, loading, refreshStats: fetchStats }}
    >
      {children}
    </UserStatsContext.Provider>
  );
};
