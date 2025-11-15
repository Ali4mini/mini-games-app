import React from "react";
import Svg, { Path, G, Text as SvgText, Circle } from "react-native-svg";

type SvgSpinWheelProps = {
  size: number;
  segments: (string | number)[];
  colors: string[];
  isSpinning?: boolean;
  spinsLeft?: number;
  theme?: any;
};

const WheelSegment = ({ size, index, angle, color }: any) => {
  const radius = size / 2;
  const startAngleRad = (index * angle - 90) * (Math.PI / 180);
  const endAngleRad = ((index + 1) * angle - 90) * (Math.PI / 180);
  const startX = radius + radius * Math.cos(startAngleRad);
  const startY = radius + radius * Math.sin(startAngleRad);
  const endX = radius + radius * Math.cos(endAngleRad);
  const endY = radius + radius * Math.sin(endAngleRad);

  // Create a path with a border
  const d = `M${radius},${radius} L${startX},${startY} A${radius},${radius} 0 0 1 ${endX},${endY} Z`;

  return (
    <G>
      <Path d={d} fill={color} stroke="#FFFFFF" strokeWidth="2" />
      {/* Add a subtle inner highlight for 3D effect */}
      <Path
        d={`M${radius},${radius} L${startX * 0.95 + radius * 0.05},${startY * 0.95 + radius * 0.05} A${radius * 0.95},${radius * 0.95} 0 0 1 ${endX * 0.95 + radius * 0.05},${endY * 0.95 + radius * 0.05} Z`}
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
      />
    </G>
  );
};

export const SvgSpinWheel: React.FC<SvgSpinWheelProps> = ({
  size,
  segments,
  colors,
  isSpinning = false,
  spinsLeft = 1,
  theme,
}) => {
  const radius = size / 2;
  const segmentAngle = 360 / segments.length;
  const centerButtonRadius = size * 0.15; // 15% of the wheel size

  // Determine button state
  const hasSpins = spinsLeft > 0;
  const buttonColor =
    !hasSpins || isSpinning
      ? theme?.textSecondary || "#CCCCCC"
      : theme?.tint || "#F43F5E";

  // Determine text
  const buttonText = isSpinning ? "SPINNING" : !hasSpins ? "NO SPINS" : "SPIN";

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <G>
        {/* Outer glow/shadow effect */}
        <Circle
          cx={radius}
          cy={radius}
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="10"
          opacity={0.3}
        />

        {/* Layer 1: The colored segments with borders */}
        {segments.map((_, index) => (
          <WheelSegment
            key={`segment-${index}`}
            size={size}
            index={index}
            angle={segmentAngle}
            color={colors[index % colors.length]}
          />
        ))}

        {/* Layer 2: The prize text with better positioning */}
        {segments.map((prize, index) => {
          // Calculate the center angle of this segment (in radians)
          const centerAngle =
            (index * segmentAngle + segmentAngle / 2 - 90) * (Math.PI / 180);

          // Position the text at 60% of the radius to center it in the segment (more conservative)
          const textX = radius + radius * 0.6 * Math.cos(centerAngle);
          const textY = radius + radius * 0.6 * Math.sin(centerAngle);

          // Calculate the rotation for the text to make it readable
          let textRotation = (index * segmentAngle + segmentAngle / 2) % 360;

          // For segments where text would be upside down, rotate 180 degrees
          if (textRotation > 90 && textRotation <= 270) {
            textRotation += 180;
          }

          // Ensure text is always upright relative to the wheel
          textRotation = textRotation % 360;

          return (
            <SvgText
              key={`prize-${index}`}
              x={textX}
              y={textY}
              fill="#FFFFFF"
              fontSize="16"
              fontWeight="bold"
              textAnchor="middle"
              alignmentBaseline="central"
              transform={`rotate(${textRotation}, ${textX}, ${textY})`}
              // Add subtle shadow for better readability
              stroke="#000000"
              strokeWidth="0.2"
            >
              {prize}
            </SvgText>
          );
        })}

        {/* Layer 3: The center spin button with enhanced glow effect */}
        {/* Multiple glow layers for better effect */}
        <Circle
          cx={radius}
          cy={radius}
          r={centerButtonRadius + 10}
          fill={buttonColor}
          opacity={0.1}
        />
        <Circle
          cx={radius}
          cy={radius}
          r={centerButtonRadius + 7}
          fill={buttonColor}
          opacity={0.2}
        />
        <Circle
          cx={radius}
          cy={radius}
          r={centerButtonRadius + 4}
          fill={buttonColor}
          opacity={0.3}
        />
        <Circle
          cx={radius}
          cy={radius}
          r={centerButtonRadius + 2}
          fill={buttonColor}
          opacity={0.5}
        />

        {/* Main button with border */}
        <Circle
          cx={radius}
          cy={radius}
          r={centerButtonRadius}
          fill={buttonColor}
          stroke={theme?.background || "#FFFFFF"}
          strokeWidth="1"
        />

        {/* Text in the center button */}
        <SvgText
          x={radius}
          y={radius}
          fill={theme?.background || "#FFFFFF"}
          fontSize="14"
          fontWeight="bold"
          textAnchor="middle"
          alignmentBaseline="central"
        >
          {buttonText}
        </SvgText>

        {/* Add a subtle inner circle for depth */}
        <Circle
          cx={radius}
          cy={radius}
          r={centerButtonRadius * 0.7}
          fill="none"
        />
      </G>
    </Svg>
  );
};
