import React from "react";
import Svg, { Path, G, Text as SvgText, Circle } from "react-native-svg";

// 1. Define the shape of your prize data
type SegmentData = {
  id: number;
  label: string;
  value: number;
  icon?: string;
};

type SvgSpinWheelProps = {
  size: number;
  segments: SegmentData[]; // Updated type
  colors: string[];
  theme?: any;
};

const WheelSegment = ({ size, index, angle, color }: any) => {
  const radius = size / 2;
  // -90 degrees shifts the start to the 12 o'clock position (Top)
  const startAngleRad = (index * angle - 90) * (Math.PI / 180);
  const endAngleRad = ((index + 1) * angle - 90) * (Math.PI / 180);

  const startX = radius + radius * Math.cos(startAngleRad);
  const startY = radius + radius * Math.sin(startAngleRad);
  const endX = radius + radius * Math.cos(endAngleRad);
  const endY = radius + radius * Math.sin(endAngleRad);

  // Create pie slice path
  const d = `M${radius},${radius} L${startX},${startY} A${radius},${radius} 0 0 1 ${endX},${endY} Z`;

  return (
    <G>
      <Path d={d} fill={color} stroke="#FFFFFF" strokeWidth="2" />
      {/* Inner Highlight for 3D effect */}
      <Path
        d={`M${radius},${radius} L${startX * 0.95 + radius * 0.05},${startY * 0.95 + radius * 0.05} A${radius * 0.95},${radius * 0.95} 0 0 1 ${endX * 0.95 + radius * 0.05},${endY * 0.95 + radius * 0.05} Z`}
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />
    </G>
  );
};

export const SvgSpinWheel: React.FC<SvgSpinWheelProps> = ({
  size,
  segments,
  colors,
}) => {
  const radius = size / 2;
  const segmentAngle = 360 / segments.length;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <G>
        {/* Outer Shadow */}
        <Circle
          cx={radius}
          cy={radius}
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="4"
        />

        {/* Layer 1: Segments */}
        {segments.map((_, index) => (
          <WheelSegment
            key={`segment-${index}`}
            size={size}
            index={index}
            angle={segmentAngle}
            color={colors[index % colors.length]}
          />
        ))}

        {/* Layer 2: Text Labels */}
        {segments.map((item, index) => {
          // Calculate center angle for text positioning
          const centerAngle =
            (index * segmentAngle + segmentAngle / 2 - 90) * (Math.PI / 180);

          // Push text out to 65% of radius
          const textX = radius + radius * 0.65 * Math.cos(centerAngle);
          const textY = radius + radius * 0.65 * Math.sin(centerAngle);

          // Text Rotation Logic
          let textRotation = (index * segmentAngle + segmentAngle / 2) % 360;
          if (textRotation > 90 && textRotation <= 270) {
            textRotation += 180;
          }

          return (
            <SvgText
              key={`text-${index}`}
              x={textX}
              y={textY}
              fill="#FFFFFF"
              fontSize="14" // Slightly smaller to fit "JACKPOT"
              fontWeight="900"
              textAnchor="middle"
              alignmentBaseline="central"
              transform={`rotate(${textRotation}, ${textX}, ${textY})`}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="0.5"
            >
              {/* Render the LABEL (e.g., "500", "Ticket") */}
              {item.label}
            </SvgText>
          );
        })}
      </G>
    </Svg>
  );
};
