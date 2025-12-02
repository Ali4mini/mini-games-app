import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase";
import { Game, GameCategories } from "@/types";
import { getStorageUrl } from "@/utils/imageHelpers";

export const useGameCatalog = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    GameCategories | "All"
  >("All");

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);

      // Start the query
      let query = supabase
        .from("games")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      // Apply Category Filter
      if (selectedCategory !== "All") {
        query = query.eq("category", selectedCategory);
      }

      // Apply Search Filter (Case insensitive)
      if (searchQuery.length > 0) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Format the data (Fix image URLs)
      const formattedGames = (data || []).map((game) => ({
        ...game,
        image: getStorageUrl("assets", game.image),
      }));

      setGames(formattedGames as Game[]);
    } catch (error) {
      console.error("Error fetching games:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory]);

  // Debounce search (Optional: add a timeout here if typing is slow)
  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  return {
    games,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    refresh: fetchGames,
  };
};
