import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  target_value: number;
  reward_coins: number;
  current_value: number; // From user_achievements
  is_completed: boolean;
  is_claimed: boolean;
};

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAchievements = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      // 1. Fetch All Achievements
      const { data: allAchievements, error: achError } = await supabase
        .from("achievements")
        .select("*")
        .order("target_value", { ascending: true });

      if (achError) throw achError;

      // 2. Fetch User Progress
      const { data: userProgress, error: progError } = await supabase
        .from("user_achievements")
        .select("*")
        .eq("user_id", session.user.id);

      if (progError) throw progError;

      // 3. Merge Data
      const merged = allAchievements.map((ach) => {
        const progress = userProgress?.find((p) => p.achievement_id === ach.id);
        const current = progress ? progress.current_value : 0;
        const claimed = progress ? progress.is_claimed : false;

        return {
          ...ach,
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
