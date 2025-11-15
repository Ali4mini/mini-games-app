// SvgSpinPointer.tsx
import React from "react";
import Svg, { Path, G } from "react-native-svg";

type SvgSpinPointerProps = {
  size?: number;
  color?: string;
  strokeColor?: string;
};

export const SvgSpinPointer: React.FC<SvgSpinPointerProps> = ({
  size = 40,
  color = "#FFA500",
  strokeColor = "#FFFFFF",
}) => {
  // Create a triangular pointer pointing UPWARD (away from the wheel)
  const pointerPath = `
    M ${size / 2} ${size} 
    L ${size * 0.7} ${size * 0.2}
    L ${size * 0.3} ${size * 0.2}
    Z
  `;

  // Create a smaller inner triangle for depth effect
  const innerPath = `
    M ${size / 2} ${size * 0.9}
    L ${size * 0.65} ${size * 0.25}
    L ${size * 0.35} ${size * 0.25}
    Z
  `;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <G>
        {/* Outer pointer with stroke */}
        <Path
          d={pointerPath}
          fill={color}
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Inner pointer for depth effect */}
        <Path
          d={innerPath}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1"
          strokeLinejoin="round"
        />

        {/* Add a small circle at the tip for a polished look */}
        <Path
          d={`M ${size / 2} ${size} A ${size * 0.05} ${size * 0.05} 0 1 1 ${size / 2} ${size}`}
          fill={strokeColor}
          stroke={strokeColor}
          strokeWidth="1"
        />

        {/* Add a subtle glow effect using a larger transparent path */}
        <Path
          d={pointerPath}
          fill="none"
          stroke={color}
          strokeWidth="6"
          opacity="0.3"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
};
