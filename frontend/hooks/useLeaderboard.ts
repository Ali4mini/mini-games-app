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
  const [currentUser, setCurrentUser] = useState<LeaderboardItem | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);

      const currentUserId = pb.authStore.model?.id;

      // 1. Fetch Top 50 Users
      // Assuming leaderboard data comes from 'users' collection
      // or a specific 'leaderboard' collection
      const resultList = await pb.collection("users").getList(1, 50, {
        sort: "-coins", // Sort by coins descending
      });

      // 2. Transform Data
      const formattedData = resultList.items.map((record, index) => ({
        id: record.id,
        username: record.username || record.name || "Unknown",
        // Pass the whole record to our updated helper
        avatar: getStorageUrl(record, record.avatar),
        score: record.coins || 0,
        rank: index + 1, // Calculate rank based on index if not in DB
      }));

      setLeaderboard(formattedData);

      // 3. Find Current User
      if (currentUserId) {
        const foundUser = formattedData.find((u) => u.id === currentUserId);
        if (foundUser) {
          setCurrentUser(foundUser);
        } else {
          // Optional: If user not in top 50, you could fetch their specific rank here
        }
      }
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return { leaderboard, currentUser, loading, refetch: fetchLeaderboard };
};
