import React from "react";
import { View, Platform, ViewStyle } from "react-native";
import { useIsFocused } from "@react-navigation/native";

interface PageWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const PageWrapper = ({ children, style }: PageWrapperProps) => {
  const isFocused = useIsFocused();
  const isWeb = Platform.OS === "web";

  // On Web: If not focused, we hide it completely using display: 'none'.
  // We use a View to ensure the container exists but is invisible.
  if (isWeb && !isFocused) {
    return <View style={{ display: "none" }} />;
  }

  return <View style={[{ flex: 1 }, style]}>{children}</View>;
};
