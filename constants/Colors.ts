/**
 * This file contains the color palette for the entire app.
 * Using the "Rose" theme with light and dark variants.
 */

export default {
  // --- Light Theme Colors (Rose Light) ---
  light: {
    // --- Text Colors ---
    textPrimary: "#18181B", // Main textPrimary color (dark)
    textSecondary: "#4B5563", // Secondary textPrimary (medium-dark gray)
    textTertiary: "#6B7280", // Tertiary/placeholder textPrimary
    textInverted: "#FFFFFF", // Text on dark backgrounds

    // --- Background Colors ---
    backgroundPrimary: "#FFF7FA", // Main app background (light pink)
    backgroundSecondary: "#FEF2F5", // Card backgrounds, secondary surfaces
    backgroundTertiary: "#FEE7EE", // Minor background elements

    // --- Brand Colors ---
    primary: "#F43F5E", // Main brand color (rose)
    primaryContent: "#FFFFFF", // Content on primary background
    secondary: "#F472B6", // Secondary brand color (lighter rose/pink)
    secondaryContent: "#4d4949", // Content on secondary background

    // --- Interactive Elements ---
    buttonPrimary: "#F43F5E", // Primary action buttons
    buttonSecondary: "#F59E0B", // Secondary action buttons
    buttonGradient: ["#FBBF24", "#F59E0B"] as const, // Gradient button

    // --- Navigation & UI Elements ---
    tabBarInactive: "#FEE7EE", // Inactive tab icons
    tabBarActive: "#F43F5E", // Active tab icons
    iconDefault: "#4B5563", // Default icon color

    // --- Status Colors ---
    success: "#10B981", // Success states (green)
    error: "#EF4444", // Error states (red)
    warning: "#F59E0B", // Warning states (amber)
    info: "#0EA5E9", // Info states (blue)
  },
  // --- Dark Theme Colors (Rose Dark) ---
  dark: {
    // --- Text Colors ---
    textPrimary: "#F4F4F5", // Main textPrimary color (light)
    textSecondary: "#D1D5DB", // Secondary textPrimary (light gray)
    textTertiary: "#9CA3AF", // Tertiary/placeholder textPrimary
    textInverted: "#18181B", // Text on light backgrounds

    // --- Background Colors ---
    backgroundPrimary: "#18181B", // Main app background (dark)
    backgroundSecondary: "#27272A", // Card backgrounds, secondary surfaces
    backgroundTertiary: "#2D2D2D", // Minor background elements

    // --- Brand Colors ---
    primary: "#F472B6", // Main brand color (lighter rose for dark theme)
    primaryContent: "#FFFFFF", // Content on primary background
    secondary: "#F472B6", // Secondary brand color
    secondaryContent: "#4d4949", // Content on secondary background

    // --- Interactive Elements ---
    buttonPrimary: "#F472B6", // Primary action buttons
    buttonSecondary: "#F59E0B", // Secondary action buttons
    buttonGradient: ["#F472B6", "#FBBF24"] as const, // Gradient button

    // --- Navigation & UI Elements ---
    tabBarInactive: "#52525B", // Inactive tab icons
    tabBarActive: "#F472B6", // Active tab icons
    iconDefault: "#D1D5DB", // Default icon color

    // --- Status Colors ---
    success: "#4AED80", // Success states (lighter green)
    error: "#F87171", // Error states (lighter red)
    warning: "#FBBF24", // Warning states (golden yellow)
    info: "#67E8F9", // Info states (light blue)
  },
};
