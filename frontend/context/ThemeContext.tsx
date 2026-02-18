import React, { createContext, useContext, useState, ReactNode } from "react";
// We no longer need useColorScheme or useEffect
// import { useColorScheme } from "react-native";
import Colors from "../constants/Colors";
import { Theme } from "@/types"; // Ensure this matches your type definition

// 1. Define the Context Shape (No changes needed here)
type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
};

// 2. Create Context (No changes needed here)
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // 1. Set the initial state directly to true for dark mode.
  //    This will be the default when the app starts.
  const [isDark, setIsDark] = useState(true);

  // 2. We have removed the useColorScheme() hook and the useEffect.
  //    The theme is now completely independent of the device settings.

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

// 3. Hooks (No changes needed here)

// Use this for STYLING
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context.theme;
};

// Use this for LOGIC (e.g., in a settings switch)
export const useThemeControl = () => {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error("useThemeControl must be used within a ThemeProvider");
  return { isDark: context.isDark, toggleTheme: context.toggleTheme };
};
