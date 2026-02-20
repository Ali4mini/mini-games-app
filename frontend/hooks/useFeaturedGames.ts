import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase";
import { Game } from "@/types";

export const useFeaturedGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeatured = useCallback(async () => {
    try {
      setLoading(true);

      // We fetch from 'featured_games' but we select the DATA from the linked 'game'
      const { data, error } = await supabase
        .from("featured_games")
        .select(
          `
          game:games (
            id,
            title,
            image,
            category,
            url,
            orientation,
            description
          )
        `,
        )
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;

      // Flatten the structure:
      // The DB returns: [ { game: { title: "..." } }, ... ]
      // We want: [ { title: "..." }, ... ]
      const formattedGames = (data || [])
        .map((item: any) => item.game) // Extract the inner game object
        .filter((game: any) => game !== null); // Safety check

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
