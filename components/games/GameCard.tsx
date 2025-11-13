import { useTheme } from "../../context/ThemeContext";
import { GameCardProps } from "@/types";
import React, { useMemo } from "react";
import { TouchableOpacity, Image, Text } from "react-native";
import { createStyles } from "./GameCard.styles";

// ====================================================================================
// --- REUSABLE SUB-COMPONENTS ---
// ====================================================================================
export const GameCard: React.FC<GameCardProps> = ({ title, image }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
