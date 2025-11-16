/**
 * This file contains shared TypeScript type definitions for the application.
 */

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

export type User = {
  name: string;
  coins: number;
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
  href: "/lucky-spin" | "/referral" | "/games-list"; // Use specific routes for type safety
};
