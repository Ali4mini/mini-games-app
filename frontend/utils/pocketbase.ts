import PocketBase, { BaseAuthStore } from "pocketbase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import EventSource from "react-native-sse";

// Polyfill EventSource
// @ts-ignore
global.EventSource = EventSource;

const pbUrl = "http://192.168.1.104:8090";

// Use BaseAuthStore instead of AsyncAuthStore for manual control
export const pb = new PocketBase(pbUrl);

// Disable auto-cancellation (prevents the "autocancelled" errors)
pb.autoCancellation(false);

export const persistAuth = async () => {
  // Manual save: takes current state and puts it in storage
  const authData = JSON.stringify({
    token: pb.authStore.token,
    model: pb.authStore.model,
  });
  await AsyncStorage.setItem("pb_auth", authData);
};

export const hydrateAuth = async () => {
  try {
    const data = await AsyncStorage.getItem("pb_auth");
    if (data) {
      const parsed = JSON.parse(data);
      // Manually load the token and model into the store
      pb.authStore.save(parsed.token, parsed.model);
      return parsed.model;
    }
  } catch (e) {
    console.error("Hydration failed", e);
  }
  return null;
};
