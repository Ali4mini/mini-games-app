/**
 * This file contains the color palette for the entire app.
 * Using the "Rose" theme with light and dark variants.
 */

export default {
  // --- Light Theme Colors (Rose Light) ---
  light: {
    // --- Text ---
    text: "#18181B", // from base-content-rgb (dark text on light background)
    textSecondary: "#4B5563", // A medium-dark gray for secondary text

    // --- Backgrounds ---
    background: "#FFF7FA", // from base-100-rgb (light pink background)
    card: "#FEF2F5", // from base-200-rgb (lighter pink card background)

    // --- Brand & Accent Colors ---
    tint: "#F43F5E", // from primary-rgb (rose primary color)
    tintContent: "#FFFFFF", //
    accent: "#F472B6", // A vibrant pink
    accentContent: "#4d4949", // A vibrant pink
    accentButton: "#F59E0B", // <-- ADD THIS (A nice gold/orange)
    accentButtonGradient: ["#FBBF24", "#F59E0B"] as const, // <-- ADD THIS LINE

    // --- Icons ---
    icon: "#4B5563", // Medium-dark color for icons
    tabIconDefault: "#FEE7EE", // from base-300-rgb
    tabIconSelected: "#F43F5E", // from primary-rgb

    // --- State Colors ---
    success: "#10B981", // from success-rgb (green)
    error: "#EF4444", // from error-rgb (red)
    warning: "#F59E0B", // from warning-rgb (amber)
    info: "#0EA5E9", // from info-rgb (blue)
  },
  // --- Dark Theme Colors (Rose Dark) ---
  dark: {
    // --- Text ---
    text: "#F4F4F5", // from base-content-rgb (light text on dark)
    textSecondary: "#D1D5DB", // Light gray for secondary text on dark

    // --- Backgrounds ---
    background: "#18181B", // from base-100-rgb (dark background)
    card: "#27272A", // from base-200-rgb (medium-dark card background)

    // --- Brand & Accent Colors ---
    tint: "#F472B6", // from primary-rgb (lighter rose primary)
    tintContent: "#FFFFFF", //
    accent: "#F472B6", // A vibrant pink
    accentContent: "#4d4949", // A vibrant pink
    accentButton: "#F59E0B", // <-- ADD THIS (A nice gold/orange)
    accentButtonGradient: ["#F472B6", "#FBBF24"] as const, // <-- ADD THIS LINE

    // --- Icons ---
    icon: "#D1D5DB", // Light color for icons on dark background
    tabIconDefault: "#52525B", // Medium-dark gray for unselected tabs
    tabIconSelected: "#F472B6", // from primary-rgb

    // --- State Colors ---
    success: "#4AED80", // from success-rgb (lighter green)
    error: "#F87171", // from error-rgb (lighter red)
    warning: "#FBBF24", // from warning-rgb (golden yellow)
    info: "#67E8F9", // from info-rgb (light blue)
  },
};
