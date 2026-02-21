import { useState, useEffect, useCallback } from "react";
import { pb } from "@/utils/pocketbase";
import { Alert } from "react-native";
import { useUserStats } from "@/context/UserStatsContext";

export type DailyRewardItem = {
  day: number;
  reward: number;
  isClaimed: boolean;
  isToday: boolean;
  isCurrentTarget: boolean;
};

export const useDailyCheckIn = () => {
  const { refreshStats } = useUserStats();
  const [loading, setLoading] = useState(true);
  const [gridData, setGridData] = useState<DailyRewardItem[]>([]);
  const [canClaim, setCanClaim] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const userId = pb.authStore.model?.id;
      if (!userId) return;

      // 1. Get Config and User Profile in parallel
      const [config, profile] = await Promise.all([
        pb.collection("daily_rewards_config").getFullList({
          sort: "day_number",
        }),
        pb.collection("users").getOne(userId),
      ]);

      if (!config || !profile) return;

      // 2. Logic: Determine status
      const lastCheckIn = new Date(profile.last_check_in || 0).toDateString();
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      const hasClaimedToday = lastCheckIn === today;
      const streakBroken = lastCheckIn !== today && lastCheckIn !== yesterday;

      let visualStreak = streakBroken ? 0 : profile.daily_streak;

      // 3. Map Data for Grid
      const mappedRewards = config.map((c) => {
        const dayIndex = c.day_number - 1;
        let isClaimed = false;
        let isCurrentTarget = false;

        if (hasClaimedToday) {
          const effectiveCycle =
            visualStreak === 0 ? 0 : ((visualStreak - 1) % 7) + 1;
          isClaimed = c.day_number <= effectiveCycle;
        } else {
          if (streakBroken) {
            isClaimed = false;
            isCurrentTarget = c.day_number === 1;
          } else {
            const effectiveCycle = visualStreak % 7;
            isClaimed = c.day_number <= effectiveCycle;
            isCurrentTarget = c.day_number === effectiveCycle + 1;
          }
        }

        return {
          day: c.day_number,
          reward: c.reward_amount,
          isClaimed,
          isToday: isCurrentTarget,
          isCurrentTarget,
        };
      });

      setGridData(mappedRewards);
      setCanClaim(!hasClaimedToday);
      setCurrentStreak(profile.daily_streak);
    } catch (err) {
      console.error("Daily check-in fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const claimReward = async () => {
    try {
      // Calling a custom endpoint we will create in PocketBase hooks later
      const data = await pb.send("/api/claim-daily-reward", {
        method: "POST",
      });

      if (!data.success) {
        Alert.alert("Info", data.message);
        return false;
      }

      await refreshStats();
      await fetchData();

      return data.reward;
    } catch (err: any) {
      const errorMsg = err.data?.message || err.message || "Failed to claim.";
      Alert.alert("Error", errorMsg);
      return false;
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { gridData, loading, canClaim, claimReward, currentStreak };
};
