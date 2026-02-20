import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase";
import { Alert } from "react-native";
import { useUserStats } from "@/context/UserStatsContext"; // To refresh coins

export type DailyRewardItem = {
  day: number;
  reward: number;
  // Visual states
  isClaimed: boolean;
  isToday: boolean;
  isCurrentTarget: boolean; // The one we are about to claim
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
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      // 1. Get Config (Day 1-7)
      const { data: config } = await supabase
        .from("daily_rewards_config")
        .select("*")
        .order("day_number", { ascending: true });

      // 2. Get User Status
      const { data: profile } = await supabase
        .from("profiles")
        .select("daily_streak, last_check_in")
        .eq("id", session.user.id)
        .single();

      if (!config || !profile) return;

      // 3. Logic: Determine status
      const lastCheckIn = new Date(profile.last_check_in || 0).toDateString();
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      const hasClaimedToday = lastCheckIn === today;
      const streakBroken = lastCheckIn !== today && lastCheckIn !== yesterday;

      // If streak is broken, they will be resetting to Day 1
      let visualStreak = streakBroken ? 0 : profile.daily_streak;

      // Calculate cycle (0-6 index)
      // If they claimed today, show current streak. If not, show current streak (waiting for +1)
      let cycleIndex = visualStreak % 7;
      if (hasClaimedToday && cycleIndex === 0) cycleIndex = 7; // Edge case for Day 7

      // Map Data for Grid
      const mappedRewards = config.map((c) => {
        // Visual Logic:
        // A day is "claimed" if:
        // 1. We claimed today AND this day index < current visual cycle index
        // 2. We haven't claimed today, but this day index < current visual cycle index

        // Simple View Logic:
        // We are on Day X (0-indexed 0 to 6).
        // Days < X are claimed.
        // Day X is: Claimed (if hasClaimedToday) OR Active (if !hasClaimedToday).

        const dayIndex = c.day_number - 1; // 0-6
        const activeCycleDay = visualStreak % 7; // 0-6 (Where the cursor is)

        // Correction: If streak is 7, activeCycle is 0. But for display, we want to show full board filled or resetting.
        // Let's rely on simple counters.

        let isClaimed = false;
        let isCurrentTarget = false;

        if (hasClaimedToday) {
          // If streak is 3 (active 3), we want days 1,2,3 claimed.
          // (day_number <= (streak % 7)) ? OR handle full cycles
          const effectiveCycle =
            visualStreak === 0 ? 0 : ((visualStreak - 1) % 7) + 1;
          isClaimed = c.day_number <= effectiveCycle;
        } else {
          // Streak is 2. We want 1, 2 claimed? No, we are aiming for 3.
          // Wait, if streak is 2, and we claim, it becomes 3.
          // So visually we show Day 1, Day 2 as claimed. Day 3 is target.

          // Handle broken streak -> everything unlocked
          if (streakBroken) {
            isClaimed = false;
            isCurrentTarget = c.day_number === 1;
          } else {
            const effectiveCycle = visualStreak % 7; // Days completed in this cycle
            isClaimed = c.day_number <= effectiveCycle;
            isCurrentTarget = c.day_number === effectiveCycle + 1;
          }
        }

        return {
          day: c.day_number,
          reward: c.reward_amount,
          isClaimed,
          isToday: isCurrentTarget, // Highlight for CSS
          isCurrentTarget,
        };
      });

      setGridData(mappedRewards);
      setCanClaim(!hasClaimedToday);
      setCurrentStreak(profile.daily_streak);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const claimReward = async () => {
    try {
      const { data, error } = await supabase.rpc("claim_daily_reward");

      if (error) throw error;
      if (!data.success) {
        Alert.alert("Info", data.message);
        return false;
      }

      // Refresh Data
      await refreshStats(); // Update global coin header
      await fetchData(); // Update local grid

      return data.reward; // Return reward amount for confetti logic
    } catch (err: any) {
      Alert.alert("Error", err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { gridData, loading, canClaim, claimReward, currentStreak };
};
