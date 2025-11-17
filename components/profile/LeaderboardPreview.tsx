import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { createStyles } from "./LeaderboardPreview.styles";
import { LeaderboardEntry } from "@/types";

type LeaderboardPreviewProps = {
  data: LeaderboardEntry[];
};

const MEDALS = ["🥇", "🥈", "🥉"];

export const LeaderboardPreview: React.FC<LeaderboardPreviewProps> = ({
  data,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const currentUser = data.find((item) => item.isCurrentUser);
  const topThree = data.filter((item) => item.rank <= 3);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("profile.leaderboard")}</Text>
      {topThree.map((item, index) => (
        <View key={item.rank} style={styles.row}>
          <Text style={styles.rank}>{MEDALS[index] || item.rank}</Text>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.coins}>💰 {item.coins.toLocaleString()}</Text>
        </View>
      ))}
      {currentUser && (
        <View style={[styles.row, styles.userRow]}>
          <Text style={styles.rank}>{currentUser.rank}</Text>
          <Text style={styles.name}>{t("profile.yourRank")}</Text>
          <Text style={styles.coins}>
            💰 {currentUser.coins.toLocaleString()}
          </Text>
        </View>
      )}
    </View>
  );
};
