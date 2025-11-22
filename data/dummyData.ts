import {
  User,
  Game,
  HeroBannerItem,
  DailyReward,
  LeaderboardUser,
  LeaderboardEntry,
} from "@/types";

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
    title: "Neon tower",
    image: "https://picsum.photos/200",
    url: "https://gamesnacks.com/games/2mk3ok3s7jl88#sc=1763720759541903263-2922803",
    orientation: "portrait",
    category: "Puzzle",
  },
  {
    id: "2",
    title: "canon",
    image: "https://picsum.photos/seed/solitaire/400/600",
    url: "https://play.famobi.com/cannon-balls-3d",
    orientation: "portrait",
    category: "Strategy",
  },
  {
    id: "3",
    title: "glass break",
    image:
      "https://img.cdn.famobi.com/portal/html5games/images/tmp/GlassBreakTeaser.jpg",
    url: "https://play.famobi.com/glass-break",
    orientation: "landscape",
    category: "Racing",
    description:
      "Smash your way through a world of motion and momentum where every throw counts. Feel the rush as you time each shot perfectly, shattering obstacles and pushing your skills to the limit. With intuitive touch controls and fluid, physics-driven gameplay, Glass Break challenges you to stay sharp and react fast. Each hit feels powerful, each miss raises the stakes, and every moment keeps you on edge. Perfect your timing, master your rhythm, and break your way to the top. Whether you’re chasing your high score or simply lost in the flow, Glass Break delivers nonstop action, smooth performance, and the pure satisfaction of every perfectly aimed throw. ",
  },
  {
    id: "4",
    title: "8 Ball Pool",
    image: "https://picsum.photos/seed/pool/400/600",
    url: "",
    orientation: "portrait",
    category: "Sports",
  },
  {
    id: "5",
    title: "Mahjong",
    image: "https://picsum.photos/seed/mahjong/400/600",
    url: "",
    orientation: "portrait",
    category: "Puzzle",
  },
  {
    id: "6",
    title: "Knife Rain",
    image: "https://picsum.photos/seed/knife/400/600",
    orientation: "portrait",
    category: "Action",
    url: "",
  },
  {
    id: "7",
    title: "Penalty Kick",
    image: "https://picsum.photos/seed/penalty/400/600",
    url: "",
    orientation: "portrait",
    category: "Sports",
  },
  {
    id: "8",
    url: "",
    title: "Tower Crash 3D",
    image: "https://picsum.photos/seed/tower/400/600",
    orientation: "portrait",
    category: "Action",
  },
  {
    id: "9",
    title: "Gold Miner Tom",
    url: "",
    image: "https://picsum.photos/seed/gold/400/600",
    category: "Adventure",
    orientation: "portrait",
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
    title: "Om Nom Run",
    image:
      "https://img.cdn.famobi.com/portal/html5games/images/tmp/OmNomRunTeaser.jpg",
    url: "https://gamesnacks.com/games/2mk3ok3s7jl88#sc=1763720759541903263-2922803",

    orientation: "portrait",
    category: "Racing",
  },
  {
    id: "1",
    title: "Bubble Shooter",
    image: "https://picsum.photos/seed/bubble/400/600",
    orientation: "portrait",
    url: "https://gamesnacks.com/games/2mk3ok3s7jl88#sc=1763720759541903263-2922803",
    category: "Puzzle",
  },
  {
    id: "2",
    title: "Solitaire",
    image: "https://picsum.photos/seed/solitaire/400/600",
    url: "https://gamesnacks.com/games/2mk3ok3s7jl88#sc=1763720759541903263-2922803",
    category: "Strategy",
    orientation: "portrait",
  },
  {
    id: "5",
    title: "Mahjong",
    image: "https://picsum.photos/seed/mahjong/400/600",
    url: "https://gamesnacks.com/games/2mk3ok3s7jl88#sc=1763720759541903263-2922803",
    orientation: "portrait",
    category: "Puzzle",
  },
];

// Corrected hero banner data with properly sized, working images
export const HERO_BANNER_DATA: HeroBannerItem[] = [
  {
    id: "1",
    title: "Spin the Wheel!",
    subtitle: "Win daily prizes and coins.",
    image: "http://192.168.1.106:8000/1763795753.png",
    href: "/lucky-spin",
  },
  {
    id: "2",
    title: "Invite a Friend",
    subtitle: "Earn 500 coins for every friend you invite.",
    image: "http://192.168.1.106:8000/1763795679.png",
    href: "/profile",
  },
  {
    id: "3",
    title: "New Games Added!",
    subtitle: "Check out the latest additions to our library.",
    image: "http://192.168.1.106:8000/1763795603.png",
    href: "/games-list",
  },
];

// Corrected featured games with working images and the required 'category' property
export const FEATURED_GAMES: Game[] = [
  {
    id: "1",
    title: "Bubble Shooter",
    image: "https://picsum.photos/seed/bubble/400/600",
    orientation: "portrait",
    url: "",
    category: "Puzzle",
  },
  {
    id: "2",
    title: "Solitaire",
    image: "https://picsum.photos/seed/solitaire/400/600",
    orientation: "portrait",
    url: "",
    category: "Strategy",
  },
  {
    id: "3",
    title: "Moto X3M",
    image: "https://picsum.photos/seed/moto/400/600",
    category: "Racing",
    orientation: "portrait",
    url: "",
  },
  {
    id: "4",
    title: "8 Ball Pool",
    image: "https://picsum.photos/seed/pool/400/600",
    category: "Sports",
    orientation: "portrait",
    url: "",
  },
  {
    id: "5",
    title: "Mahjong",
    image: "https://picsum.photos/seed/mahjong/400/600",
    category: "Puzzle",
    orientation: "portrait",
    url: "",
  },
];

export const LEADERBOARD_USERS: LeaderboardUser[] = [
  {
    id: "1",
    username: "TopGamer",
    avatar: "https://via.placeholder.com/40x40/FF6B6B/FFFFFF?textPrimary=TG",
    coins: 15420,
    rank: 1,
    dailyStreak: 28,
    totalGamesPlayed: 142,
    isOnline: true,
  },
  {
    id: "2",
    username: "CoinCollector",
    avatar: "https://via.placeholder.com/40x40/4ECDC4/FFFFFF?textPrimary=CC",
    coins: 14230,
    rank: 2,
    dailyStreak: 25,
    totalGamesPlayed: 138,
    isOnline: false,
  },
  {
    id: "3",
    username: "DailyMaster",
    avatar: "https://via.placeholder.com/40x40/45B7D1/FFFFFF?textPrimary=DM",
    coins: 12890,
    rank: 3,
    dailyStreak: 30,
    totalGamesPlayed: 125,
    isOnline: true,
  },
  {
    id: "4",
    username: "LuckyWinner",
    avatar: "https://via.placeholder.com/40x40/96CEB4/FFFFFF?textPrimary=LW",
    coins: 11560,
    rank: 4,
    dailyStreak: 18,
    totalGamesPlayed: 110,
    isOnline: true,
  },
  {
    id: "5",
    username: "GameChamp",
    avatar: "https://via.placeholder.com/40x40/FFEAA7/000000?textPrimary=GC",
    coins: 10890,
    rank: 5,
    dailyStreak: 22,
    totalGamesPlayed: 130,
    isOnline: false,
  },
  {
    id: "6",
    username: "WeeklyWinner",
    avatar: "https://via.placeholder.com/40x40/DDA0DD/FFFFFF?textPrimary=WW",
    coins: 9870,
    rank: 6,
    dailyStreak: 15,
    totalGamesPlayed: 95,
    isOnline: true,
  },
  {
    id: "7",
    username: "CoinKing",
    avatar: "https://via.placeholder.com/40x40/98D8C8/FFFFFF?textPrimary=CK",
    coins: 8950,
    rank: 7,
    dailyStreak: 12,
    totalGamesPlayed: 88,
    isOnline: false,
  },
  {
    id: "8",
    username: "GameMaster",
    avatar: "https://via.placeholder.com/40x40/F7DC6F/000000?textPrimary=GM",
    coins: 7890,
    rank: 8,
    dailyStreak: 10,
    totalGamesPlayed: 75,
    isOnline: true,
  },
  {
    id: "9",
    username: "DailyWinner",
    avatar: "https://via.placeholder.com/40x40/BB8FCE/FFFFFF?textPrimary=DW",
    coins: 6750,
    rank: 9,
    dailyStreak: 8,
    totalGamesPlayed: 65,
    isOnline: true,
  },
  {
    id: "10",
    username: "NewPlayer",
    avatar: "https://via.placeholder.com/40x40/85C1E9/FFFFFF?textPrimary=NP",
    coins: 5430,
    rank: 10,
    dailyStreak: 5,
    totalGamesPlayed: 42,
    isOnline: false,
  },
];

// UPDATE the USER_DATA object to match the new User type
export const USER_DATA: User = {
  id: "user_123",
  name: "PlayerOne",
  coins: 1250,
  avatarUrl: "https://picsum.photos/seed/avatar/200",
  joinDate: "2023-10-27",
  referralCode: "EARN-A2B4C6",
};

// ADD new data for the leaderboard preview
export const LEADERBOARD_DATA: LeaderboardEntry[] = [
  { rank: 1, name: "ProGamerX", coins: 54320 },
  { rank: 2, name: "CoinMaster", coins: 48910 },
  { rank: 3, name: "PixelQueen", coins: 45100 },
  // ... more users would be here in a real API response
  {
    rank: 127,
    name: USER_DATA.name,
    coins: USER_DATA.coins,
    isCurrentUser: true,
  },
];
