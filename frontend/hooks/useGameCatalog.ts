import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase";
import { Game, GameCategories } from "@/types";
import { getStorageUrl } from "@/utils/imageHelpers";

const PAGE_SIZE = 10;

export const useGameCatalog = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false); // For initial load & refresh
  const [loadingMore, setLoadingMore] = useState(false); // For infinite scroll
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    GameCategories | "All"
  >("All");

  // Pagination State
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchGames = useCallback(
    async (pageNumber = 0) => {
      const isReseting = pageNumber === 0;

      // Set loading states
      if (isReseting) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const from = pageNumber * PAGE_SIZE;
        const to = (pageNumber + 1) * PAGE_SIZE - 1;

        // Start the query
        let query = supabase
          .from("games")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .range(from, to);

        // Apply Category Filter
        if (selectedCategory !== "All") {
          query = query.eq("category", selectedCategory);
        }

        // Apply Search Filter
        if (searchQuery.length > 0) {
          query = query.ilike("title", `%${searchQuery}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Format the data
        const formattedGames = (data || []).map((game) => ({
          ...game,
          image: getStorageUrl("assets", game.image),
        }));

        // Update State (FIXED DUPLICATE LOGIC)
        if (isReseting) {
          setGames(formattedGames as Game[]);
        } else {
          setGames((prev) => {
            // 1. Create a Set of existing IDs for fast lookup
            const existingIds = new Set(prev.map((g) => g.id));

            // 2. Only keep new games that don't exist in the current state
            const uniqueNewGames = (formattedGames as Game[]).filter(
              (game) => !existingIds.has(game.id),
            );

            // 3. Combine them
            return [...prev, ...uniqueNewGames];
          });
        }

        // Determine if there is more data to load
        // If we received fewer items than requested, we are at the end.
        if (data.length < PAGE_SIZE) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        setPage(pageNumber);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [searchQuery, selectedCategory],
  );

  // Effect: Reset and Fetch when filters change
  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchGames(0);
  }, [searchQuery, selectedCategory, fetchGames]);

  // Helper: Trigger infinite scroll
  const loadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      fetchGames(page + 1);
    }
  };

  // Helper: Trigger Pull-to-Refresh
  const refresh = () => {
    setPage(0);
    setHasMore(true);
    fetchGames(0);
  };

  return {
    games,
    loading,
    loadingMore,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    refresh,
    loadMore,
    hasMore,
  };
};
