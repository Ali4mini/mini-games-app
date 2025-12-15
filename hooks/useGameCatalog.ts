import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/utils/supabase";
import { Game, GameCategories } from "@/types";
import { getStorageUrl } from "@/utils/imageHelpers";

const PAGE_SIZE = 10;

export const useGameCatalog = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false); // Initial load
  const [loadingMore, setLoadingMore] = useState(false); // Pagination load
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    GameCategories | "All"
  >("All");

  // Pagination State
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // We use a ref to prevent race conditions during rapid filter changes
  const currentRequest = useRef(0);

  const fetchGames = useCallback(
    async (pageNumber = 0) => {
      const isReseting = pageNumber === 0;

      // Prevent fetching if we are already loading specific types of requests
      if (isReseting) setLoading(true);
      else setLoadingMore(true);

      try {
        const from = pageNumber * PAGE_SIZE;
        const to = (pageNumber + 1) * PAGE_SIZE - 1;

        // Start the query
        let query = supabase
          .from("games")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .range(from, to); // <--- Add Range Here

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

        if (isReseting) {
          setGames(formattedGames as Game[]);
        } else {
          setGames((prev) => [...prev, ...(formattedGames as Game[])]);
        }

        // Check if we reached the end
        setHasMore(data.length === PAGE_SIZE);
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

  // Effect: Trigger fetch when Filters change (Search or Category)
  // This resets the list to Page 0
  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchGames(0);
  }, [searchQuery, selectedCategory, fetchGames]);

  // Function to call for Infinite Scroll
  const loadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      fetchGames(page + 1);
    }
  };

  // Function to pull-to-refresh
  const refresh = () => {
    setPage(0);
    setHasMore(true);
    fetchGames(0);
  };

  return {
    games,
    loading, // Used for initial skeleton/spinner
    loadingMore, // Used for footer spinner
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    refresh, // Used for PullControl
    loadMore, // Used for onEndReached
    hasMore, // Used to hide footer if done
  };
};
