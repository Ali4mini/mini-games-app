// THIS MUST BE AT THE VERY TOP
import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const supabaseUrl = "https://mysteryplay.fun";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE";

// --- CUSTOM STORAGE ADAPTER ---
// Prevents "window is not defined" error during Expo Web Build (SSR/SSG)
const SafeStorage = {
  getItem: (key: string) => {
    // If on Web Server (Build time), return nothing
    if (Platform.OS === "web" && typeof window === "undefined") {
      return Promise.resolve(null);
    }
    return AsyncStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === "web" && typeof window === "undefined") {
      return Promise.resolve();
    }
    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (Platform.OS === "web" && typeof window === "undefined") {
      return Promise.resolve();
    }
    return AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "", {
  auth: {
    storage: SafeStorage, // <--- Use the safe adapter
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
