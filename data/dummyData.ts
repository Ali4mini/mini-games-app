// --- Type Definitions ---
import { User, Game, HeroBannerItem } from "../types"; // Import your type definitions

export const HERO_BANNER_DATA: HeroBannerItem[] = [
  {
    id: "1",
    title: "Spin the Wheel!",
    subtitle: "Win daily prizes and coins.",
    image: "https://picsum.photos/id/1/200/300",
    href: "/lucky-spin",
  },
  {
    id: "2",
    title: "Invite a Friend",
    subtitle: "Earn 500 coins for every friend you invite.",
    image: "https://picsum.photos/id/27/3264/1836",
    href: "/referral",
  },
  {
    id: "3",
    title: "New Games Added!",
    subtitle: "Check out the latest additions to our library.",
    image: "https://picsum.photos/id/32/1/1", // A new generic banner image
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
      "https://fastly.picsum.photos/id/22/4434/3729.jpg?hmac=fjZdkSMZJNFgsoDh8Qo5zdA_nSGUAWvKLyyqmEt2xs0", // TODO: the images won't show, fix that
  },
  {
    id: "2",
    title: "Solitaire",
    image: "https://picsum.photos/id/27/3264/1836", // A new generic banner image
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
