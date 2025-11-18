import React from "react";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "@/context/ThemeContext";

type TabBarBackgroundProps = {
  width: number;
  height: number;
};

export const TabBarBackground: React.FC<TabBarBackgroundProps> = ({
  width,
  height,
}) => {
  const theme = useTheme();

  // THE FIX: This new path string has a larger corner radius (40px instead of 20px).
  // We start drawing from y=40 and curve up to y=0 over a 40px width.
  const path = `
    M 0 40 
    C 0 20, 20 0, 40 0
    L ${width / 2 - 45} 0
    C ${width / 2 - 20} 0, ${width / 2 - 25} 30, ${width / 2} 30
    C ${width / 2 + 25} 30, ${width / 2 + 20} 0, ${width / 2 + 45} 0
    L ${width - 40} 0
    C ${width - 20} 0, ${width} 20, ${width} 40
    L ${width} ${height}
    L 0 ${height}
    Z
  `;

  return (
    <Svg
      width={width}
      height={height}
      style={{ position: "absolute", bottom: 0 }}
    >
      <Path d={path} fill={theme.backgroundSecondary} />
    </Svg>
  );
};
