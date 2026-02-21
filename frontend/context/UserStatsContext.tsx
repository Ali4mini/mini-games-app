import React, { createContext, useContext, useEffect, useState } from "react";
import { pb } from "@/utils/pocketbase";
import { useAuth } from "./AuthContext";
import { getStorageUrl } from "@/utils/imageHelpers";

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
  const { user } = useAuth(); // Changed from 'session' to 'user'
  const [stats, setStats] = useState<UserStats>({
    coins: 0,
    avatar: "https://via.placeholder.com/150",
    name: "Guest",
    spinsLeft: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    if (!user?.id) return;

    try {
      // PocketBase: Fetch the user record directly from 'users' collection
      const record = await pb.collection("users").getOne(user.id);

      setStats({
        coins: record.coins || 0,
        avatar:
          getStorageUrl(record, record.avatar) ||
          "https://via.placeholder.com/150",
        name: record.name || record.username || "Player",
        spinsLeft: record.daily_spins_left ?? 0,
      });
    } catch (err) {
      console.error("Error fetching user stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    // 1. Initial Fetch
    fetchStats();

    // 2. Realtime Subscription
    // PocketBase subscription is much cleaner.
    // You can subscribe to a specific record ID directly.
    pb.collection("users").subscribe(user.id, (e) => {
      console.log("Realtime update received from PocketBase!", e.record);

      const newRecord = e.record;

      setStats((prev) => ({
        ...prev,
        coins: newRecord.coins,
        spinsLeft: newRecord.daily_spins_left,
        name: newRecord.name || prev.name,
        // Update avatar using the helper and the new record data
        avatar: getStorageUrl(newRecord, newRecord.avatar),
      }));
    });

    return () => {
      // Unsubscribe from specific record
      pb.collection("users").unsubscribe(user.id);
    };
  }, [user?.id]); // Only re-run if the user ID changes

  return (
    <UserStatsContext.Provider
      value={{ stats, loading, refreshStats: fetchStats }}
    >
      {children}
    </UserStatsContext.Provider>
  );
};
