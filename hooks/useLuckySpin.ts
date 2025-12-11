import { useState } from "react";
import { supabase } from "@/utils/supabase";
import { Alert } from "react-native";
import { useUserStats } from "@/context/UserStatsContext";

export const useLuckySpin = () => {
  const [loading, setLoading] = useState(false);

  // 1. Consume the Global Context
  // We don't need to fetch spins here. The Context does it.
  const { refreshStats } = useUserStats();

  const playSpin = async () => {
    try {
      setLoading(true);

      // 2. Call the Server Logic
      const { data, error } = await supabase.rpc("play_lucky_spin");

      if (error) throw error;

      if (!data.success) {
        Alert.alert(
          "Out of Spins",
          data.message || "Please wait for tomorrow.",
        );
        return null;
      }

      // 3. Trigger Global Update
      // Since your Context is listening to Realtime changes, this might happen automatically.
      // However, calling refreshStats() explicitly ensures the UI updates immediately
      // without waiting for the WebSocket event latency.
      await refreshStats();

      // Return data for the wheel animation
      return {
        winnerIndex: data.index,
        rewardAmount: data.reward,
      };
    } catch (error: any) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error("Spin error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Note: We do NOT return 'spinsLeft' here.
  // The UI should get 'spinsLeft' directly from 'useUserStats()'.
  return { playSpin, loading };
};
