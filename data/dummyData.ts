// --- Type Definitions ---
import { User, Game } from "../types"; // Import your type definitions

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
