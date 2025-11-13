import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { createStyles } from "./AppTitleHeader.styles";

type AppTitleHeaderProps = {
  appName: string;
};

export const AppTitleHeader: React.FC<AppTitleHeaderProps> = ({ appName }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{appName}</Text>
    </View>
  );
};
