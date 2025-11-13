// --- Type Definitions ---
import { User, Game, HeroBannerItem } from "../types"; // Import your type definitions

export const HERO_BANNER_DATA: HeroBannerItem[] = [
  {
    id: "1",
    title: "Spin the Wheel!",
    subtitle: "Win daily prizes and coins.",
    image: "https://i.ibb.co/L5rR1yN/spin-banner.png",
    href: "/lucky-spin",
  },
  {
    id: "2",
    title: "Invite a Friend",
    subtitle: "Earn 500 coins for every friend you invite.",
    image: "https://i.ibb.co/bFwqVGr/referral-banner.png", // A new generic banner image
    href: "/referral",
  },
  {
    id: "3",
    title: "New Games Added!",
    subtitle: "Check out the latest additions to our library.",
    image: "https://i.ibb.co/Jqj8c7V/new-games-banner.png", // Another generic banner
    href: "/games-list",
  },
];

// --- Dummy Data ---
export const USER_DATA: User = {
  name: "PlayerOne",
  coins: 1250,
};

export const FEATURED_GAMES: Game[] = [
  {
    id: "1",
    title: "Bubble Shooter",
    image:
      "https://file-examples.com/wp-content/storage/2017/10/file_example_JPG_100kB.jpg", // TODO: the images won't show, fix that
  },
  {
    id: "2",
    title: "Solitaire",
    image:
      "https://img.cdn.famobi.com/portal/html5games/images/tmp/SolitaireClassicBig.jpg",
  },
  {
    id: "3",
    title: "Moto X3M",
    image:
      "https://img.cdn.famobi.com/portal/html5games/images/tmp/MotoX3mBig.jpg",
  },
  {
    id: "4",
    title: "8 Ball Pool",
    image:
      "https://img.cdn.famobi.com/portal/html5games/images/tmp/8BallBillardsClassicBig.jpg",
  },
  {
    id: "5",
    title: "Mahjong",
    image:
      "https://img.cdn.famobi.com/portal/html5games/images/tmp/MahjongConnectBig.jpg",
  },
];
