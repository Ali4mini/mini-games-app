/**
 * This file contains shared TypeScript type definitions for the application.
 */

export interface LeaderboardUser {
  id: string;
  username: string;
  avatar: string;
  coins: number;
  rank: number;
  dailyStreak: number;
  totalGamesPlayed: number;
  isOnline?: boolean;
}

export type DailyReward = {
  day: number;
  reward: number;
  claimed: boolean;
};

export type Game = {
  id: string;
  title: string;
  image: string;
  category?:
    | "Puzzle"
    | "Action"
    | "Strategy"
    | "Racing"
    | "Sports"
    | "Adventure"; // Add category
};

export type Theme = {
  text: string;
  textSecondary: string;
  background: string;
  card: string;
  tint: string;
  tintContent: string;
  accent: string;
  accentContent: string;
  accentButton: string;
  accentButtonGradient: readonly string[]; // Use a more general type here
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  success: string;
  error: string;
  warning: string;
  info: string;
};

export type GameCardProps = {
  title: string;
  image: string;
};

export type HeroBannerItem = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  href: "/lucky-spin" | "/profile" | "/games-list" | "/leaderboard"; // Use specific routes for type safety
};

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  earnedCoins: number;
  pendingRewards: number;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  joinDate: string;
  level: number;
  coins: number;
  referralCode: string;
}

export interface ProfileProps {
  theme: Theme;
  user: UserProfile;
  referralStats: ReferralStats;
}

// Add new properties to the User type
export type User = {
  id: string; // Add a user ID
  name: string;
  coins: number;
  avatarUrl: string;
  joinDate: string; // Will be a string like "2023-10-27"
  referralCode: string;
};

// Create a new type for leaderboard entries
export type LeaderboardEntry = {
  rank: number;
  name: string;
  coins: number;
  isCurrentUser?: boolean; // Optional flag for the current user
};
