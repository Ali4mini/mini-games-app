import { useState } from "react";
import { pb } from "@/utils/pocketbase";
import { Alert } from "react-native";
import { useUserStats } from "@/context/UserStatsContext";

export const useLuckySpin = () => {
  const [loading, setLoading] = useState(false);
  const { refreshStats } = useUserStats();

  const playSpin = async () => {
    try {
      setLoading(true);

      /**
       * POCKETBASE ARCHITECTURE NOTE:
       * In Supabase, you used an RPC. In PocketBase, you usually:
       * 1. POST to a custom route: pb.send("/api/play-lucky-spin", { method: "POST" })
       * 2. OR Create a record in a 'spins' collection that triggers a server-side hook.
       */

      // Option A: Custom Route (Standard way to port RPC logic)
      const data = await pb.send("/api/play-lucky-spin", {
        method: "POST",
      });

      if (!data.success) {
        Alert.alert(
          "Out of Spins",
          data.message || "Please wait for tomorrow.",
        );
        return null;
      }

      // Trigger Global Update
      await refreshStats();

      return {
        winnerIndex: data.index,
        rewardAmount: data.reward,
      };
    } catch (error: any) {
      // PocketBase errors usually have a 'data' object or 'message'
      const errorMsg =
        error.data?.message || error.message || "Something went wrong.";
      Alert.alert("Error", errorMsg);
      console.error("Spin error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { playSpin, loading };
};
