import React from "react";
import Svg, {
  Path,
  G,
  Text as SvgText,
  Circle,
  Defs,
  RadialGradient,
  Stop,
  LinearGradient,
  Pattern,
} from "react-native-svg";

type SegmentData = {
  id: number;
  label: string;
  value: number;
};

type SvgSpinWheelProps = {
  size: number;
  segments: SegmentData[];
  colors: string[];
};

const WheelSegment = ({ size, index, angle, color, isJackpot }: any) => {
  const radius = size / 2;
  const drawRadius = radius - 15;
  const startAngleRad = (index * angle - 90) * (Math.PI / 180);
  const endAngleRad = ((index + 1) * angle - 90) * (Math.PI / 180);

  const startX = radius + drawRadius * Math.cos(startAngleRad);
  const startY = radius + drawRadius * Math.sin(startAngleRad);
  const endX = radius + drawRadius * Math.cos(endAngleRad);
  const endY = radius + drawRadius * Math.sin(endAngleRad);

  const d = `M${radius},${radius} L${startX},${startY} A${drawRadius},${drawRadius} 0 0 1 ${endX},${endY} Z`;

  return (
    <G>
      {/* 1. BASE COLOR (or Gold Gradient for Jackpot) */}
      <Path
        d={d}
        fill={isJackpot ? "url(#goldJackpot)" : color}
        // Add a thick border to separate segments clearly
        stroke={isJackpot ? "#FFF" : "rgba(255,255,255,0.2)"}
        strokeWidth="2"
      />

      {/* 2. DEPTH OVERLAY (For Standard Segments) 
          This adds a shadow at the outer edge to make it look curved */}
      {!isJackpot && <Path d={d} fill="url(#segmentDepth)" />}

      {/* 3. GLOSS HIGHLIGHT (For Standard Segments) 
          This adds a "shiny plastic" look */}
      {!isJackpot && <Path d={d} fill="url(#segmentGloss)" opacity="0.4" />}

      {/* 4. JACKPOT SPECIAL EFFECTS */}
      {isJackpot && (
        <>
          <Path d={d} fill="url(#glitterPattern)" opacity="0.4" />
          <Path d={d} fill="url(#segmentGloss)" opacity="0.2" />
        </>
      )}
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
  const rimLights = Array.from({ length: segments.length * 2 }).map(
    (_, i) => i,
  );
  const lightAngle = 360 / rimLights.length;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        {/* --- 1. DEPTH GRADIENT (The "Vignette") --- 
            Darkens the outer edge, transparent in center */}
        <RadialGradient id="segmentDepth" cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="40%" stopColor="black" stopOpacity="0" />
          <Stop offset="100%" stopColor="black" stopOpacity="0.35" />
        </RadialGradient>

        {/* --- 2. GLOSS GRADIENT (The "Shine") --- 
            Adds a white sheen to simulate plastic reflection */}
        <LinearGradient id="segmentGloss" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <Stop offset="50%" stopColor="white" stopOpacity="0" />
          <Stop offset="100%" stopColor="white" stopOpacity="0" />
        </LinearGradient>

        {/* --- 3. JACKPOT GOLD --- */}
        <RadialGradient id="goldJackpot" cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0%" stopColor="#FFF7CC" />
          <Stop offset="40%" stopColor="#FFD700" />
          <Stop offset="100%" stopColor="#B8860B" />
        </RadialGradient>

        {/* --- 4. RIM METAL --- */}
        <LinearGradient id="rimGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#444" />
          <Stop offset="50%" stopColor="#999" />
          <Stop offset="100%" stopColor="#333" />
        </LinearGradient>

        {/* --- 5. GLITTER --- */}
        <Pattern
          id="glitterPattern"
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <Circle cx="2" cy="2" r="1" fill="white" opacity="0.5" />
          <Circle cx="7" cy="7" r="1" fill="white" opacity="0.3" />
        </Pattern>
      </Defs>

      <G>
        {/* OUTER RIM */}
        <Circle
          cx={radius}
          cy={radius}
          r={radius - 2}
          fill="url(#rimGrad)"
          stroke="#111"
          strokeWidth="2"
        />

        {/* INNER DARK BG */}
        <Circle cx={radius} cy={radius} r={radius - 12} fill="#1a1a1a" />

        {/* SEGMENTS */}
        {segments.map((item, index) => {
          const isJackpot =
            item.label.toLowerCase().includes("jackpot") || item.value >= 5000;
          return (
            <WheelSegment
              key={`segment-${index}`}
              size={size}
              index={index}
              angle={segmentAngle}
              color={colors[index % colors.length]}
              isJackpot={isJackpot}
            />
          );
        })}

        {/* RIM LIGHTS (Bulbs) */}
        {rimLights.map((_, i) => {
          const angleRad = (i * lightAngle - 90) * (Math.PI / 180);
          const lightRadius = radius - 7;
          const lx = radius + lightRadius * Math.cos(angleRad);
          const ly = radius + lightRadius * Math.sin(angleRad);

          return (
            <React.Fragment key={`light-${i}`}>
              {/* Bulb Glow */}
              <Circle
                cx={lx}
                cy={ly}
                r={4}
                fill={i % 2 === 0 ? "#FFD700" : "#FFF"}
                opacity="0.3"
              />
              {/* Bulb Core */}
              <Circle
                cx={lx}
                cy={ly}
                r={2.5}
                fill={i % 2 === 0 ? "#FFD700" : "#FFF"}
              />
            </React.Fragment>
          );
        })}

        {/* TEXT */}
        {segments.map((item, index) => {
          const isJackpot =
            item.label.toLowerCase().includes("jackpot") || item.value >= 5000;
          const centerAngle =
            (index * segmentAngle + segmentAngle / 2 - 90) * (Math.PI / 180);
          const textX = radius + (radius - 45) * Math.cos(centerAngle);
          const textY = radius + (radius - 45) * Math.sin(centerAngle);

          let textRotation = (index * segmentAngle + segmentAngle / 2) % 360;
          if (textRotation > 90 && textRotation <= 270) textRotation += 180;

          return (
            <G key={`text-${index}`}>
              {/* Drop Shadow for Text */}
              <SvgText
                x={textX + 1}
                y={textY + 1}
                fill="rgba(0,0,0,0.6)"
                fontSize={isJackpot ? "16" : "14"}
                fontWeight="900"
                textAnchor="middle"
                alignmentBaseline="central"
                transform={`rotate(${textRotation}, ${textX}, ${textY})`}
              >
                {item.label}
              </SvgText>

              {/* Foreground Text */}
              <SvgText
                x={textX}
                y={textY}
                fill={isJackpot ? "#78350f" : "#FFFFFF"}
                fontSize={isJackpot ? "16" : "14"}
                fontWeight="900"
                textAnchor="middle"
                alignmentBaseline="central"
                transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                stroke={isJackpot ? "#FFF" : "none"}
                strokeWidth={isJackpot ? "0.5" : "0"}
              >
                {item.label}
              </SvgText>
            </G>
          );
        })}

        {/* CENTER INNER SHADOW */}
        <Circle cx={radius} cy={radius} r={30} fill="black" opacity="0.4" />
      </G>
    </Svg>
  );
};
