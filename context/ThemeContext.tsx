import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useColorScheme } from "react-native";
import Colors from "../constants/Colors";
import { Theme } from "@/types"; // Ensure this matches your type definition

// 1. Define the Context Shape
type ThemeContextType = {
  theme: Theme;          // The actual color object (Colors.light or Colors.dark)
  isDark: boolean;       // Boolean helper
  toggleTheme: () => void; // Function to switch modes
};

// 2. Create Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === "dark");

  // Update local state if system changes (optional, can be removed if you want strict manual control)
  useEffect(() => {
    if (systemScheme) {
      setIsDark(systemScheme === "dark");
    }
  }, [systemScheme]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Hooks

// Use this for STYLING (keeps your existing code working)
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context.theme;
};

// Use this for LOGIC (toggling buttons)
export const useThemeControl = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useThemeControl must be used within a ThemeProvider");
  return { isDark: context.isDark, toggleTheme: context.toggleTheme };
};
