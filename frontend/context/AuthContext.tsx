import React, { createContext, useContext, useEffect, useState } from "react";
import { pb, initPocketBase } from "@/utils/pocketbase";
import { AuthModel } from "pocketbase";

type AuthContextType = {
  user: AuthModel | null; // PocketBase calls the user object a "model"
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  isValid: boolean; // Helper to check if logged in
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  isAdmin: false,
  isValid: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthModel | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initialize the store from AsyncStorage
    const initializeAuth = async () => {
      try {
        await initPocketBase();

        // Sync initial state
        setUser(pb.authStore.model);
        setToken(pb.authStore.token);
      } catch (error) {
        console.error("PocketBase init error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // 2. Listen for auth changes (Login, Logout)
    // PocketBase triggers this whenever the authStore changes
    const removeListener = pb.authStore.onChange((token, model) => {
      setUser(model);
      setToken(token);
    });

    return () => {
      removeListener(); // Cleanup
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isValid: pb.authStore.isValid,
        isAdmin: false, // You can check user?.role === 'admin' here
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
