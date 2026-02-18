/**
 * Theme: Neon Arcade
 * Vibe: Cyberpunk, Gaming, High Energy
 * Colors: Violet, Electric Blue, Slate
 */

export default {
  // --- Light Theme (Clean & Digital) ---
  light: {
    textPrimary: "#111827", // Gray 900
    textSecondary: "#4B5563", // Gray 600
    textTertiary: "#9CA3AF", // Gray 400
    textInverted: "#FFFFFF",

    backgroundPrimary: "#F5F3FF", // Light Violet tint
    backgroundSecondary: "#FFFFFF", // Pure White cards
    backgroundTertiary: "#EDE9FE", // Violet 100

    primary: "#7C3AED", // Violet 600
    primaryContent: "#FFFFFF",
    secondary: "#06B6D4", // Cyan 500 (Pop color)
    secondaryContent: "#FFFFFF",

    buttonPrimary: "#7C3AED",
    buttonSecondary: "#06B6D4",
    buttonGradient: ["#8B5CF6", "#2DD4BF"] as const, // Violet to Teal

    tabBarInactive: "#C4B5FD",
    tabBarActive: "#7C3AED",
    iconDefault: "#6B7280",

    success: "#059669",
    error: "#DC2626",
    warning: "#D97706",
    info: "#2563EB",
  },

  // --- Dark Theme (Immersive Gaming Mode) ---
  dark: {
    textPrimary: "#F9FAFB", // Gray 50
    textSecondary: "#D1D5DB", // Gray 300
    textTertiary: "#6B7280", // Gray 500
    textInverted: "#000000",

    backgroundPrimary: "#0F172A", // Slate 900 (Deep Blue-Black)
    backgroundSecondary: "#1E293B", // Slate 800
    backgroundTertiary: "#334155", // Slate 700

    primary: "#A78BFA", // Violet 400 (Lighter for dark mode)
    primaryContent: "#FFFFFF",
    secondary: "#22D3EE", // Cyan 400
    secondaryContent: "#0F172A", // Dark text on bright button

    buttonPrimary: "#8B5CF6",
    buttonSecondary: "#0EA5E9",
    buttonGradient: ["#7C3AED", "#22D3EE"] as const,

    tabBarInactive: "#475569",
    tabBarActive: "#A78BFA",
    iconDefault: "#94A3B8",

    success: "#34D399",
    error: "#F87171",
    warning: "#FBBF24",
    info: "#60A5FA",
  },
};
