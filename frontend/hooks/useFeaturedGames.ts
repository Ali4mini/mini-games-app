import { useState, useEffect, useCallback } from "react";
import { pb } from "@/utils/pocketbase";
import { Game } from "@/types";
import { getStorageUrl } from "@/utils/imageHelpers";

export const useFeaturedGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeatured = useCallback(async () => {
    try {
      setLoading(true);

      const records = await pb.collection("featured_games").getFullList({
        filter: "is_active = true",
        sort: "display_order",
        // 1. FIXED: Changed "game" to "game_id" to match your schema
        expand: "game_id",
      });

      console.log("Raw records from PB:", records);

      // 2. Map the data using the correct expand key
      const formattedGames = records
        .map((item) => {
          // Use the correct field name here as well
          const gameRecord = item.expand?.game_id;

          if (!gameRecord) {
            console.warn(
              `No expanded game found for featured record: ${item.id}. Check API permissions.`,
            );
            return null;
          }

          const gameFormattedRecord: Game = {
            id: gameRecord.id,
            title: gameRecord.title,
            image: getStorageUrl(gameRecord, gameRecord.image),
            category: gameRecord.category,
            url: gameRecord.url,
            orientation: gameRecord.orientation,
            description: gameRecord.description,
          };

          return gameFormattedRecord;
        })
        .filter((g): g is Game => g !== null);

      setGames(formattedGames);
    } catch (error) {
      console.error("Error fetching featured games:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  return { games, loading, refetch: fetchFeatured };
};
