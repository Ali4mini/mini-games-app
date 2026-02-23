import React, { createContext, useContext, useEffect, useState } from "react";
import { pb, hydrateAuth, persistAuth } from "@/utils/pocketbase";
import { AuthModel } from "pocketbase";

type AuthContextType = {
  session: AuthModel | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<AuthModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        // 1. Manually read the disk
        const model = await hydrateAuth();
        if (model) {
          setSession(model);
        }
      } catch (e) {
        console.log("Bootstrap error", e);
      } finally {
        // 2. Delay loading slightly to ensure Expo Router is ready
        setTimeout(() => setLoading(false), 100);
      }
    };

    bootstrap();

    // 3. Listen for any auth changes (Login/Logout)
    const removeListener = pb.authStore.onChange((token, model) => {
      setSession(model);
      // Every time the user logs in or out, update the disk
      persistAuth();
    });

    return () => removeListener();
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
