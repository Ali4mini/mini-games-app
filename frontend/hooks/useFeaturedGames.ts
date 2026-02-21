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

      // 1. Fetch from featured_games and expand the 'game' relation
      const records = await pb.collection("featured_games").getFullList({
        filter: "is_active = true",
        sort: "display_order",
        expand: "game", // This tells PB to include the related game record
      });

      // 2. Flatten the structure
      // PocketBase puts expanded relations in the 'expand' property
      const formattedGames = records
        .map((item) => {
          const gameRecord = item.expand?.game;
          if (!gameRecord) return null;

          return {
            id: gameRecord.id,
            title: gameRecord.title,
            // Don't forget to resolve the image from the expanded record
            image: getStorageUrl(gameRecord, gameRecord.image),
            category: gameRecord.category,
            url: gameRecord.url,
            orientation: gameRecord.orientation,
            description: gameRecord.description,
          };
        })
        .filter((g) => g !== null);

      setGames(formattedGames as Game[]);
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
