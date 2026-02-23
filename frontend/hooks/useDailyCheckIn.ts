import { useState, useEffect, useCallback } from "react";
import { pb, persistAuth } from "@/utils/pocketbase";
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

      // 1. Force absolute NO CACHE headers so React Native cannot serve stale data
      const [config, profile] = await Promise.all([
        pb.collection("daily_rewards_config").getFullList({
          sort: "day_number",
          $autoCancel: false,
        }),
        pb.collection("users").getOne(userId, {
          $autoCancel: false,
          headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
          _: Date.now(), // Cache-buster
        }),
      ]);

      // 2. USE STRICT STRING MANIPULATION (No 'new Date()' for PB strings!)
      // This prevents React Native from crashing with "Invalid Date"
      const now = new Date();
      const todayIso = now.toISOString().substring(0, 10); // "YYYY-MM-DD"

      const yesterday = new Date();
      yesterday.setUTCDate(yesterday.getUTCDate() - 1);
      const yesterdayIso = yesterday.toISOString().substring(0, 10);

      // PocketBase dates always start with "YYYY-MM-DD". Extracting just
      // the first 10 characters prevents all timezone and formatting bugs.
      const rawDate = profile.last_check_in || "1970-01-01";
      const lastCheckInIso = rawDate.substring(0, 10);

      const hasClaimedToday = lastCheckInIso === todayIso;
      const streakBroken =
        lastCheckInIso !== todayIso && lastCheckInIso !== yesterdayIso;
      const visualStreak = streakBroken ? 0 : profile.daily_streak;

      // 3. Map Grid
      const mappedRewards = config.map((c) => {
        let isClaimed = false;
        let isToday = false;

        if (hasClaimedToday) {
          const effectiveCycle =
            visualStreak === 0 ? 0 : ((visualStreak - 1) % 7) + 1;
          isClaimed = c.day_number <= effectiveCycle;
          isToday = c.day_number === effectiveCycle;
        } else {
          if (streakBroken) {
            isToday = c.day_number === 1;
          } else {
            const effectiveCycle = visualStreak % 7;
            isClaimed = c.day_number <= effectiveCycle;
            isToday = c.day_number === effectiveCycle + 1;
          }
        }

        return {
          day: c.day_number,
          reward: c.reward_amount,
          isClaimed,
          isToday,
          isCurrentTarget: isToday,
        };
      });

      setGridData(mappedRewards);
      setCanClaim(!hasClaimedToday);
      setCurrentStreak(profile.daily_streak);
    } catch (err) {
      console.error("Fetch Daily Check-in Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const claimReward = async () => {
    try {
      const response = await pb.send("/api/claim-daily-reward", {
        method: "POST",
      });

      if (!response.success) {
        Alert.alert("Info", response.message);
        return false;
      }

      // 1. Immediately update local auth store with the newly returned user
      if (response.user) {
        pb.authStore.save(pb.authStore.token, response.user);
        if (persistAuth) await persistAuth();
      }

      // 2. Refetch the UI grid from scratch to guarantee it aligns perfectly
      await fetchData();

      // 3. Update global stats context (Coins/XP) AFTER the grid is updated
      if (refreshStats) {
        await refreshStats();
      }

      // 4. Return the integer so `if (rewardAmount)` fires Confetti in UI!
      return response.reward || 0;
    } catch (err: any) {
      console.error("Claim Exception:", err);
      Alert.alert("Error", err.message || "Failed to claim.");
      return false;
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { gridData, loading, canClaim, claimReward, currentStreak };
};
