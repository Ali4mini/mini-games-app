import { useState, useEffect, useCallback } from "react";
import { pb } from "@/utils/pocketbase";
import { getStorageUrl } from "@/utils/imageHelpers";

export type LeaderboardItem = {
  id: string;
  username: string;
  avatar: string;
  score: number;
  rank: number;
};

export const useLeaderboard = () => {
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number>(0);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);

      // Call the custom Go route
      const data = await pb.send("/api/leaderboard", {
        method: "GET",
      });

      // Map the results
      const formatted = data.leaderboard.map((item: any) => ({
        id: item.id,
        username: item.username,
        avatar: getStorageUrl(item, item.avatar), // Make sure helper is updated
        score: item.coins,
        rank: item.rank,
      }));

      setLeaderboard(formatted);
      setCurrentUserRank(data.user_rank);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return { leaderboard, currentUserRank, loading, refetch: fetchLeaderboard };
};
