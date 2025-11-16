import { User, Game, HeroBannerItem, DailyReward } from "../types";

// Data for the 7-day check-in calendar
// In a real app, 'claimed' status would come from a user's profile
export const DAILY_REWARDS: DailyReward[] = [
  { day: 1, reward: 50, claimed: true },
  { day: 2, reward: 75, claimed: true },
  { day: 3, reward: 100, claimed: true },
  { day: 4, reward: 125, claimed: false }, // Today's reward, not yet claimed
  { day: 5, reward: 150, claimed: false },
  { day: 6, reward: 200, claimed: false },
  { day: 7, reward: 500, claimed: false }, // Big reward for a full week streak
];

export const SPIN_WHEEL_PRIZES: (string | number)[] = [
  100, // Prize for segment 0
  "Try Again",
  500,
  25,
  250,
  "No Prize",
  1000,
  50,
];

// A longer list of games for the all games page with working images
export const ALL_GAMES: Game[] = [
  {
    id: "1",
    title: "Bubble Shooter",
    image: "https://picsum.photos/200",
    category: "Puzzle",
  },
  {
    id: "2",
    title: "Solitaire",
    image: "https://picsum.photos/seed/solitaire/400/600",
    category: "Strategy",
  },
  {
    id: "3",
    title: "Moto X3M",
    image: "https://picsum.photos/seed/moto/400/600",
    category: "Racing",
  },
  {
    id: "4",
    title: "8 Ball Pool",
    image: "https://picsum.photos/seed/pool/400/600",
    category: "Sports",
  },
  {
    id: "5",
    title: "Mahjong",
    image: "https://picsum.photos/seed/mahjong/400/600",
    category: "Puzzle",
  },
  {
    id: "6",
    title: "Knife Rain",
    image: "https://picsum.photos/seed/knife/400/600",
    category: "Action",
  },
  {
    id: "7",
    title: "Penalty Kick",
    image: "https://picsum.photos/seed/penalty/400/600",
    category: "Sports",
  },
  {
    id: "8",
    title: "Tower Crash 3D",
    image: "https://picsum.photos/seed/tower/400/600",
    category: "Action",
  },
  {
    id: "9",
    title: "Gold Miner Tom",
    image: "https://picsum.photos/seed/gold/400/600",
    category: "Adventure",
  },
];

export const GAME_CATEGORIES: string[] = [
  "All",
  "Puzzle",
  "Action",
  "Strategy",
  "Racing",
  "Sports",
  "Adventure",
];

// Corrected recently played games with working images and the required 'category' property
export const RECENTLY_PLAYED_GAMES: Game[] = [
  {
    id: "3",
    title: "Moto X3M",
    image: "https://picsum.photos/seed/moto/400/600",
    category: "Racing",
  },
  {
    id: "1",
    title: "Bubble Shooter",
    image: "https://picsum.photos/seed/bubble/400/600",
    category: "Puzzle",
  },
  {
    id: "2",
    title: "Solitaire",
    image: "https://picsum.photos/seed/solitaire/400/600",
    category: "Strategy",
  },
  {
    id: "5",
    title: "Mahjong",
    image: "https://picsum.photos/seed/mahjong/400/600",
    category: "Puzzle",
  },
];

// Corrected hero banner data with properly sized, working images
export const HERO_BANNER_DATA: HeroBannerItem[] = [
  {
    id: "1",
    title: "Spin the Wheel!",
    subtitle: "Win daily prizes and coins.",
    image: "https://picsum.photos/seed/spin/800/450",
    href: "/lucky-spin",
  },
  {
    id: "2",
    title: "Invite a Friend",
    subtitle: "Earn 500 coins for every friend you invite.",
    image: "https://picsum.photos/seed/friend/800/450",
    href: "/referral",
  },
  {
    id: "3",
    title: "New Games Added!",
    subtitle: "Check out the latest additions to our library.",
    image: "https://picsum.photos/seed/newgames/800/450",
    href: "/games-list",
  },
];

export const USER_DATA: User = {
  name: "PlayerOne",
  coins: 1250,
};

// Corrected featured games with working images and the required 'category' property
export const FEATURED_GAMES: Game[] = [
  {
    id: "1",
    title: "Bubble Shooter",
    image: "https://picsum.photos/seed/bubble/400/600",
    category: "Puzzle",
  },
  {
    id: "2",
    title: "Solitaire",
    image: "https://picsum.photos/seed/solitaire/400/600",
    category: "Strategy",
  },
  {
    id: "3",
    title: "Moto X3M",
    image: "https://picsum.photos/seed/moto/400/600",
    category: "Racing",
  },
  {
    id: "4",
    title: "8 Ball Pool",
    image: "https://picsum.photos/seed/pool/400/600",
    category: "Sports",
  },
  {
    id: "5",
    title: "Mahjong",
    image: "https://picsum.photos/seed/mahjong/400/600",
    category: "Puzzle",
  },
];
