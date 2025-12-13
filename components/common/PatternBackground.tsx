import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Defs, Pattern, Rect, Path, Circle, G } from "react-native-svg";
import { useTheme } from "@/context/ThemeContext";

interface PatternBackgroundProps {
  children: React.ReactNode;
}

const PatternBackground: React.FC<PatternBackgroundProps> = ({ children }) => {
  const theme = useTheme();

  const isDark = theme.backgroundPrimary === "#0F172A" || theme.type === "dark";

  // --- Configuration ---
  // 1. Background Color: The solid base color
  const backgroundColor = theme.backgroundPrimary;

  // 2. Pattern Color: The color of the little icons
  // In dark mode, we use a light gray/violet. In light mode, a dark gray/violet.
  const patternColor = isDark ? theme.textTertiary : theme.primary;

  // 3. Opacity: Very low so it's subtle (WhatsApp style)
  const patternOpacity = isDark ? 0.2 : 0.15;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* The SVG Texture Layer */}
      <View style={StyleSheet.absoluteFill}>
        <Svg height="100%" width="100%">
          <Defs>
            {/* 
              Define the repeating pattern unit.
              Width/Height 120 creates the spacing between icons.
            */}
            <Pattern
              id="game-pattern"
              x="0"
              y="0"
              width="120"
              height="120"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)" // Rotates the whole grid 45deg for a diamond look
            >
              <G
                stroke={patternColor}
                strokeWidth="1.5"
                fill="none"
                opacity={patternOpacity}
              >
                {/* ICON 1: Gamepad (Top Left) */}
                <Path
                  d="M5 15 C5 10 10 10 10 10 H30 C30 10 35 10 35 15 V25 C35 30 30 30 28 30 L25 25 L15 25 L12 30 C10 30 5 30 5 25 Z"
                  transform="translate(10, 10)"
                />
                <Circle
                  cx="18"
                  cy="20"
                  r="1.5"
                  fill={patternColor}
                  transform="translate(10, 10)"
                />
                <Circle
                  cx="32"
                  cy="20"
                  r="1.5"
                  fill={patternColor}
                  transform="translate(10, 10)"
                />

                {/* ICON 2: MysteryPlay Lightning (Top Right) */}
                <Path
                  d="M10 0 L0 12 H8 L6 20 L16 8 H8 L10 0Z"
                  transform="translate(70, 10) scale(1.2)"
                />

                {/* ICON 3: Coin (Bottom Left) */}
                <Circle cx="10" cy="10" r="8" transform="translate(10, 70)" />
                <Path
                  d="M10 6 V14 M8 6 H12 M8 14 H12 M8 10 H12"
                  transform="translate(10, 70)"
                />

                {/* ICON 4: Arcade Ghost (Bottom Right) */}
                <Path
                  d="M4 16 V6 C4 2 12 2 12 6 V16 L10 14 L8 16 L6 14 L4 16Z"
                  transform="translate(70, 70) scale(1.3)"
                />
                <Circle
                  cx="8"
                  cy="8"
                  r="1"
                  fill={patternColor}
                  transform="translate(70, 70) scale(1.3)"
                />
                <Circle
                  cx="12"
                  cy="8"
                  r="1"
                  fill={patternColor}
                  transform="translate(70, 70) scale(1.3)"
                />
              </G>
            </Pattern>
          </Defs>

          {/* Fill the whole screen with the pattern defined above */}
          <Rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#game-pattern)"
          />
        </Svg>
      </View>

      {/* App Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});

export default PatternBackground;
