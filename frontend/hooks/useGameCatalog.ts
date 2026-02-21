import { useState, useEffect, useCallback } from "react";
import { pb } from "@/utils/pocketbase";
import { Game, GameCategories } from "@/types";
import { getStorageUrl } from "@/utils/imageHelpers";

const PAGE_SIZE = 10;

export const useGameCatalog = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    GameCategories | "All"
  >("All");

  const [page, setPage] = useState(1); // PocketBase is 1-indexed
  const [hasMore, setHasMore] = useState(true);

  const fetchGames = useCallback(
    async (pageNumber = 1) => {
      const isReseting = pageNumber === 1;

      if (isReseting) setLoading(true);
      else setLoadingMore(true);

      try {
        // 1. Build Filter String
        let filters = ["is_active = true"];

        if (selectedCategory !== "All") {
          filters.push(`category = "${selectedCategory}"`);
        }

        if (searchQuery.length > 0) {
          // '~' is the "like/contains" operator in PocketBase
          filters.push(`title ~ "${searchQuery}"`);
        }

        // 2. Execute Query
        const resultList = await pb
          .collection("games")
          .getList(pageNumber, PAGE_SIZE, {
            filter: filters.join(" && "),
            sort: "-created", // PocketBase uses 'created' instead of 'created_at' by default
          });

        // 3. Format Data
        const formattedGames = resultList.items.map((game) => ({
          ...game,
          // Use the record-based image helper
          image: getStorageUrl(game, game.image),
        }));

        // 4. Update State
        if (isReseting) {
          setGames(formattedGames as unknown as Game[]);
        } else {
          setGames((prev) => {
            const existingIds = new Set(prev.map((g) => g.id));
            const uniqueNewGames = (formattedGames as unknown as Game[]).filter(
              (game) => !existingIds.has(game.id),
            );
            return [...prev, ...uniqueNewGames];
          });
        }

        // 5. Pagination Logic
        setHasMore(pageNumber < resultList.totalPages);
        setPage(pageNumber);
      } catch (error: any) {
        if (!error.isAbort) {
          console.error("Error fetching games:", error);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [searchQuery, selectedCategory],
  );

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchGames(1);
  }, [searchQuery, selectedCategory, fetchGames]);

  const loadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      fetchGames(page + 1);
    }
  };

  const refresh = () => {
    setPage(1);
    setHasMore(true);
    fetchGames(1);
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
