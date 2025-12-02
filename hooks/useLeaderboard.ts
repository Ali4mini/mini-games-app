import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase";
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

      // 1. Get Current User ID
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id;

      // 2. Fetch Leaderboard (Limit to Top 50 for performance)
      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .order("rank", { ascending: true })
        .limit(50);

      if (error) throw error;

      // 3. Transform Data
      const formattedData = data.map((item) => ({
        id: item.user_id, // Map 'user_id' from view to 'id'
        username: item.username || "Unknown",
        // Use helper to resolve avatar URL
        avatar: getStorageUrl("assets", item.avatar_url),
        score: item.coins, // Using 'coins' as score
        rank: item.rank,
      }));

      setLeaderboard(formattedData);

      // 4. Find Current User
      if (currentUserId) {
        const foundUser = formattedData.find((u) => u.id === currentUserId);
        if (foundUser) {
          setCurrentUser(foundUser);
        } else {
          // If user is not in top 50, we might need a separate fetch for their specific rank
          // For now, we'll leave it null or handle edge case
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
