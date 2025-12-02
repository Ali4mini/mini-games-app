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

export const SPIN_WHEEL_PRIZES = [
  { id: 1, label: "20", icon: "coins", value: 20 }, // Index 0 (30% chance)
  { id: 2, label: "50", icon: "coins", value: 50 }, // Index 1 (25% chance)
  { id: 3, label: "100", icon: "coins", value: 100 }, // Index 2 (20% chance)
  { id: 4, label: "200", icon: "coins", value: 200 }, // Index 3 (10% chance)
  { id: 5, label: "500", icon: "coins", value: 500 }, // Index 4 (5% chance)
  { id: 6, label: "1K", icon: "coins", value: 1000 }, // Index 5 (2% chance)
  { id: 7, label: "Ticket", icon: "ticket", value: 50 }, // Index 6 (8% chance)
  { id: 8, label: "JACKPOT", icon: "trophy", value: 5000 }, // Index 7 (0% chance - super rare)
];

// A longer list of games for the all games page with working images
export const ALL_GAMES: Game[] = [
  {
    id: "1",
    title: "Om Nom Run",
    image:
      "https://img.cdn.famobi.com/portal/html5games/images/tmp/OmNomRunTeaser.jpg",
    url: "https://play.famobi.com/om-nom-run",
    orientation: "portrait",
    category: "Action",
    description:
      "Join Om Nom in an exciting running adventure through the dangerous streets of Nomville! Dodge obstacles, collect coins, and perform stunts to unlock new characters in this high-speed endless runner.",
  },
  {
    id: "2",
    title: "Moto X3M Pool Party",
    image:
      "https://img.cdn.famobi.com/portal/html5games/images/tmp/MotoX3mPoolPartyTeaser.jpg",
    url: "https://play.famobi.com/moto-x3m-pool-party",
    orientation: "landscape",
    category: "Racing",
    description:
      "Grab your motorbike, strap on your helmet and grab some airtime over obstacles and beat the clock on amazing off-road circuits. The Pool Party edition brings splashing fun to the extreme racing series.",
  },
  {
    id: "3",
    title: "Cars Arena",
    image:
      "https://img.cdn.famobi.com/portal/html5games/images/tmp/CarsArenaTeaser.jpg",
    url: "https://play.famobi.com/cars-arena",
    orientation: "portrait",
    category: "Arcade",
    description:
      "Chop, slice, and dice your way to the top! A satisfying ASMR experience where you must slice vegetables while avoiding the obstacles. Perfect for quick, stress-relieving gameplay.",
  },
  {
    id: "4",
    title: "Bubble Tower 3D",
    image:
      "https://img.cdn.famobi.com/portal/html5games/images/tmp/BubbleTower3dTeaser.jpg",
    url: "https://play.famobi.com/bubble-tower-3d",
    orientation: "landscape",
    category: "Puzzle",
    description:
      "Experience the classic bubble shooter in a whole new dimension. Rotate the tower to find the perfect angle and pop matching bubbles before they reach the bottom.",
  },
  {
    id: "5",
    title: "Table Tennis World Tour",
    image:
      "https://img.cdn.famobi.com/portal/html5games/images/tmp/TableTennisWorldTourTeaser.jpg",
    url: "https://play.famobi.com/table-tennis-world-tour",
    orientation: "landscape",
    category: "Sports",
    description:
      "Pick your nation and battle your way through the World Tour. Master the paddle with precise swipes to spin and smash the ball past your opponent.",
  },
  {
    id: "6",
    title: "Color Road",
    image:
      "https://img.cdn.famobi.com/portal/html5games/images/tmp/ColorRoadTeaser.jpg",
    url: "https://play.famobi.com/color-road",
    orientation: "portrait",
    category: "Arcade",
    description:
      "Control a rolling ball along a winding track in space. Your mission is simple: only hit balls that match your color. Hit a different color, and it's game over!",
  },
  {
    id: "7",
    title: "Cannon Surfer",
    image:
      "https://img.cdn.famobi.com/portal/html5games/images/tmp/CannonSurferTeaser.jpg",
    url: "https://play.famobi.com/cannon-surfer",
    orientation: "portrait",
    category: "Action",
    description:
      "Blast your way through obstacles while surfing! Use your cannon to clear the path ahead in this addictive, high-octane action game.",
  },
  {
    id: "8",
    title: "Smarty Bubbles",
    image:
      "https://img.cdn.famobi.com/portal/html5games/images/tmp/SmartyBubblesTeaser.jpg",
    url: "https://play.famobi.com/smarty-bubbles",
    orientation: "portrait",
    category: "Casual",
    description:
      "One of the most popular bubble shooters in the world. Simple, addictive, and perfect for high-score chasing. Match 3 bubbles to pop them and clear the field.",
  },
  {
    id: "9",
    title: "Gold Miner Tom",
    image:
      "https://img.cdn.famobi.com/portal/html5games/images/tmp/GoldMinerTomTeaser.jpg",
    url: "https://play.famobi.com/gold-miner-tom",
    orientation: "landscape",
    category: "Adventure",
    description:
      "Help Tom use his claw to mine for gold, diamonds, and other treasures. Time your throws carefully to grab the most valuable items before the time runs out.",
  },
  {
    id: "10",
    title: "Diamond Rush",
    image:
      "https://img.cdn.famobi.com/portal/html5games/images/tmp/DiamondRushTeaser.jpg",
    url: "https://play.famobi.com/diamond-rush",
    orientation: "portrait",
    category: "Puzzle",
    description:
      "A fast-paced match-3 game. Be quick! You have limited time to match as many colorful diamonds as possible and trigger explosive chain reactions.",
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
export const RECENTLY_PLAYED_GAMES: Game[] = ALL_GAMES.slice(0, 5);

// Corrected hero banner data with properly sized, working images
export const HERO_BANNER_DATA: HeroBannerItem[] = [
  {
    id: "1",
    title: "Spin the Wheel!",
    subtitle: "Win daily prizes and coins.",
    image: require("../assets/images/banner1.png"),
    href: "/lucky-spin",
  },
  {
    id: "2",
    title: "Invite a Friend",
    subtitle: "Earn 500 coins for every friend you invite.",
    image: require("../assets/images/banner2.png"),
    href: "/profile",
  },
  {
    id: "3",
    title: "New Games Added!",
    subtitle: "Check out the latest additions to our library.",
    image: require("../assets/images/banner3.png"),
    href: "/games-list",
  },
];

// Corrected featured games with working images and the required 'category' property
export const FEATURED_GAMES: Game[] = ALL_GAMES.slice(0, 5);

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
