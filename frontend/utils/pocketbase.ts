import PocketBase, { AsyncAuthStore } from "pocketbase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Replace with your PocketBase URL
const pbUrl = "http://192.168.1.100:8090/";

// --- CUSTOM STORAGE HANDLER ---
// PocketBase's AsyncAuthStore handles the logic for us,
// but we wrap it to ensure SSR/Web compatibility.
const store = new AsyncAuthStore({
  save: async (batch) => {
    if (Platform.OS === "web" && typeof window === "undefined") return;
    return AsyncStorage.setItem("pb_auth", batch);
  },
  initial: undefined, // We will load this manually or let the store handle it
});

export const pb = new PocketBase(pbUrl, store);

// Helper to check if we are hydrated (loaded from storage)
export const initPocketBase = async () => {
  if (Platform.OS === "web" && typeof window === "undefined") return;
  const data = await AsyncStorage.getItem("pb_auth");
  if (data) {
    pb.authStore.loadFromCookie(data);
  }
};
