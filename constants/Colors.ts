/**
 * This file contains the color palette for the entire app.
 * We are using the user-provided "Modern Blue" theme.
 */

// We don't need the tintColor variables anymore as the theme objects are self-contained.

export default {
  // --- Light Theme Colors ---
  light: {
    // --- Text ---
    text: "#0F172A", // from base-content-rgb
    textSecondary: "#334155", // from a slightly lighter gray in the same family (Slate 700)

    // --- Backgrounds ---
    background: "#F8FAFC", // from base-100-rgb
    card: "#FFFFFF", // Standard white for cards provides good contrast

    // --- Brand & Accent Colors ---
    tint: "#2563EB", // from primary-rgb
    accent: "#3B82F6", // from secondary-rgb

    // --- Icons ---
    icon: "#334155", // A good medium-dark color for icons
    tabIconDefault: "#CBD5E1",
    tabIconSelected: "#2563EB", // from primary-rgb

    // --- State Colors ---
    success: "#10B981", // from success-rgb
    error: "#EF4444", // from error-rgb
    warning: "#F59E0B", // from warning-rgb
    info: "#0EA5E9", // from info-rgb
  },
  // --- Dark Theme Colors ---
  dark: {
    // --- Text ---
    text: "#CBD5E1", // from base-content-rgb
    textSecondary: "#94A3B8", // from a slightly darker gray in the same family (Slate 400)

    // --- Backgrounds ---
    background: "#0F172A", // from base-100-rgb
    card: "#1E293B", // from base-200-rgb

    // --- Brand & Accent Colors ---
    tint: "#3B82F6", // from primary-rgb
    accent: "#60A5FA", // from secondary-rgb

    // --- Icons ---
    icon: "#94A3B8", // A good medium-light color for icons
    tabIconDefault: "#475569",
    tabIconSelected: "#3B82F6", // from primary-rgb

    // --- State Colors ---
    success: "#4AED80", // from success-rgb
    error: "#F87171", // from error-rgb
    warning: "#FBBF24", // from warning-rgb
    info: "#67E8F9", // from info-rgb
  },
};
