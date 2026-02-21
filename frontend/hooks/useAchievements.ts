import { useState, useEffect, useCallback } from "react";
import { pb } from "@/utils/pocketbase";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  target_value: number;
  reward_coins: number;
  current_value: number;
  is_completed: boolean;
  is_claimed: boolean;
};

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAchievements = useCallback(async () => {
    try {
      setLoading(true);

      const userId = pb.authStore.model?.id;
      if (!userId) return;

      // 1. Fetch All Achievements & User Progress in parallel
      const [allAchievements, userProgress] = await Promise.all([
        pb.collection("achievements").getFullList({
          sort: "target_value",
        }),
        pb.collection("user_achievements").getFullList({
          filter: `user = "${userId}"`, // Assuming the field is named 'user'
        }),
      ]);

      // 2. Merge Data
      const merged = allAchievements.map((ach) => {
        const progress = userProgress?.find((p) => p.achievement === ach.id);
        const current = progress ? progress.current_value : 0;
        const claimed = progress ? progress.is_claimed : false;

        return {
          id: ach.id,
          title: ach.title,
          description: ach.description,
          icon: ach.icon,
          target_value: ach.target_value,
          reward_coins: ach.reward_coins,
          current_value: current,
          is_completed: current >= ach.target_value,
          is_claimed: claimed,
        };
      });

      setAchievements(merged);
    } catch (error) {
      console.error("Error fetching achievements:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  return { achievements, loading, refetch: fetchAchievements };
};
