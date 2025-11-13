/**
 * This file contains the color palette for the entire app.
 * Using the "Sunset" theme with light and dark variants.
 */

export default {
  // --- Light Theme Colors (Sunset Light) ---
  light: {
    // --- Text ---
    text: "#14120A", // from base-content-rgb (dark text on light background)
    textSecondary: "#4B5563", // A medium-dark gray for secondary text

    // --- Backgrounds ---
    background: "#FFF7ED", // from base-100-rgb (light cream background)
    card: "#FFFBF5", // from base-200-rgb (slightly darker card background)

    // --- Brand & Accent Colors ---
    tint: "#F97316", // from primary-rgb (orange primary color)
    accent: "#FB923C", // from secondary-rgb (lighter orange secondary color)

    // --- Icons ---
    icon: "#4B5563", // Medium-dark color for icons
    tabIconDefault: "#FED7AA", // from base-300-rgb
    tabIconSelected: "#F97316", // from primary-rgb

    // --- State Colors ---
    success: "#10B981", // from success-rgb (green)
    error: "#EF4444", // from error-rgb (red)
    warning: "#F59E0B", // from warning-rgb (amber)
    info: "#0EA5E9", // from info-rgb (blue)
  },
  // --- Dark Theme Colors (Sunset Dark) ---
  dark: {
    // --- Text ---
    text: "#FBBF24", // from base-content-rgb (golden yellow text on dark)
    textSecondary: "#F59E0B", // from warning-rgb (amber for secondary text)

    // --- Backgrounds ---
    background: "#14120A", // from base-100-rgb (very dark background)
    card: "#282414", // from base-200-rgb (dark card background)

    // --- Brand & Accent Colors ---
    tint: "#FB923C", // from primary-rgb (lighter orange primary)
    accent: "#FDBA74", // from secondary-rgb (even lighter orange secondary)

    // --- Icons ---
    icon: "#FED7AA", // from base-300-rgb (lighter color for icons)
    tabIconDefault: "#4B5563", // Medium gray for unselected tabs
    tabIconSelected: "#FB923C", // from primary-rgb

    // --- State Colors ---
    success: "#4AED80", // from success-rgb (lighter green)
    error: "#F87171", // from error-rgb (lighter red)
    warning: "#FBBF24", // from warning-rgb (golden yellow)
    info: "#67E8F9", // from info-rgb (light blue)
  },
};
