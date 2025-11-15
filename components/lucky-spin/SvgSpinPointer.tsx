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
  color = "#F43F5E",
  strokeColor = "#FFFFFF",
}) => {
  // Create a pointer pointing DOWNWARD (toward the wheel)
  const pointerPath = `
    M ${size / 2} ${size}
    L ${size * 0.8} ${size * 0.4}
    L ${size * 0.6} ${size * 0.4}
    L ${size * 0.6} 0
    L ${size * 0.4} 0
    L ${size * 0.4} ${size * 0.4}
    L ${size * 0.2} ${size * 0.4}
    Z
  `;

  // Create a highlight effect
  const highlightPath = `
    M ${size / 2} ${size - 2}
    L ${size * 0.75} ${size * 0.45}
    L ${size * 0.55} ${size * 0.45}
    L ${size * 0.55} 2
    L ${size * 0.45} 2
    L ${size * 0.45} ${size * 0.45}
    L ${size * 0.25} ${size * 0.45}
    Z
  `;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <G>
        {/* Shadow/outline */}
        <Path
          d={pointerPath}
          fill={strokeColor}
          opacity="0.3"
          transform={`translate(0, -2)`}
        />

        {/* Main pointer */}
        <Path
          d={pointerPath}
          fill={color}
          stroke={strokeColor}
          strokeWidth="1"
        />

        {/* Highlight for 3D effect */}
        <Path d={highlightPath} fill="rgba(255,255,255,0.3)" />

        {/* Add a small shine effect at the tip */}
        <Path
          d={`M ${size * 0.45} ${size - 3} L ${size * 0.55} ${size - 3} L ${size / 2} ${size - 8} Z`}
          fill="rgba(255,255,255,0.6)"
        />
      </G>
    </Svg>
  );
};
