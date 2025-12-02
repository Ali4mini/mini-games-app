import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase";
import { Alert } from "react-native";

export const useLuckySpin = () => {
  const [loading, setLoading] = useState(true);
  const [spinsLeft, setSpinsLeft] = useState(0);

  // 1. Fetch initial state
  const fetchSpinState = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("daily_spins_left, last_spin_date")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;

      // Handle Daily Reset Client-Side Visuals
      // (Server handles logic, this is just to show correct number immediately)
      const lastDate = new Date(data.last_spin_date).toDateString();
      const today = new Date().toDateString();

      if (lastDate !== today) {
        setSpinsLeft(3); // Visual reset
      } else {
        setSpinsLeft(data.daily_spins_left);
      }
    } catch (error) {
      console.error("Error fetching spins:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpinState();
  }, [fetchSpinState]);

  // 2. Play Function
  const playSpin = async () => {
    try {
      const { data, error } = await supabase.rpc("play_lucky_spin");

      if (error) throw error;
      if (!data.success) {
        Alert.alert("Out of Spins", data.message);
        return null;
      }

      // Update local state
      setSpinsLeft(data.spins_left);

      // Return the winning index so the wheel knows where to stop
      return {
        winnerIndex: data.index,
        rewardAmount: data.reward,
      };
    } catch (error: any) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error(error);
      return null;
    }
  };

  return { spinsLeft, playSpin, loading };
};
