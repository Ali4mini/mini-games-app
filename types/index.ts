/**
 * This file contains shared TypeScript type definitions for the application.
 */
import Colors from "@/constants/Colors";

export type Theme = typeof Colors.light;

export type User = {
  name: string;
  coins: number;
};

export type Game = {
  id: string;
  title: string;
  image: string;
};

export type GameCardProps = {
  title: string;
  image: string;
};
