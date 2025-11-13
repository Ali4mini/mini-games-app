import React, { createContext, useContext, ReactNode } from "react";
import { useColorScheme } from "react-native";
import Colors from "../constants/Colors";

// Define the shape of the context value
// It will be one of the themes from our Colors file
type ThemeContextType = typeof Colors.light | typeof Colors.dark;

// Create the context with a default value (light theme)
const ThemeContext = createContext<ThemeContextType>(Colors.light);

// Create the ThemeProvider component
type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Use the built-in hook to get the device's color scheme
  const colorScheme = useColorScheme();

  // Select the theme based on the color scheme. Default to light if null/undefined.
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

/**
 * A custom hook to easily access the theme context.
 * This is a best practice to abstract away the `useContext` call.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
