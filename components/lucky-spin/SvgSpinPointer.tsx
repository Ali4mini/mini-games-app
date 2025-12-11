import React from "react";
import Svg, { Path, G, Defs, LinearGradient, Stop } from "react-native-svg";

type Props = {
  size?: number;
};

export const SvgSpinPointer: React.FC<Props> = ({ size = 50 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 50 50">
      <Defs>
        <LinearGradient id="pointerGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFD700" />
          <Stop offset="1" stopColor="#FFA500" />
        </LinearGradient>
      </Defs>
      <G>
        {/* Drop Shadow (Simulated) */}
        <Path
          d="M 25 50 L 40 15 L 10 15 Z"
          fill="black"
          opacity="0.3"
          transform="translate(0, 4)"
        />
        {/* Main Pointer Body */}
        <Path
          d="M 25 48 L 40 15 L 35 5 L 15 5 L 10 15 Z"
          fill="url(#pointerGrad)"
          stroke="#FFF"
          strokeWidth="1.5"
        />
        {/* The Mounting Pin */}
        <Path d="M 25 15 L 25 5" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
      </G>
    </Svg>
  );
};
