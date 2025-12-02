import { useState, useEffect } from "react";

export const useDailyTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState<string>("00:00:00");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();

      // Target: Tonight at 00:00:00 (Start of tomorrow)
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);

      const diff = midnight.getTime() - now.getTime();

      if (diff <= 0) {
        return "00:00:00"; // Should trigger a refresh logic ideally
      }

      // Convert ms to HH:MM:SS
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const h = hours < 10 ? `0${hours}` : hours;
      const m = minutes < 10 ? `0${minutes}` : minutes;
      const s = seconds < 10 ? `0${seconds}` : seconds;

      return `${h}:${m}:${s}`;
    };

    // Initial call
    setTimeRemaining(calculateTimeLeft());

    // Update every second
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return timeRemaining;
};
