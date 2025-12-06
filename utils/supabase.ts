// 1. THIS MUST BE AT THE VERY TOP
import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// 2. Debugging: Log these to your terminal to make sure they are loaded!
// const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
export const supabaseUrl = "https://rotten-ravens-pump.loca.lt";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl); // Should not be undefined
console.log("Supabase Key Present:", !!supabaseAnonKey); // Should be true

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "", {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
