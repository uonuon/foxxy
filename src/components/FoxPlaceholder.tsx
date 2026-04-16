import React from "react";
import { View } from "react-native";
import Svg, { Circle, Ellipse, Path, G } from "react-native-svg";
import { MotiView } from "moti";

import { palette } from "@/theme/colors";

export type FoxState = "idle" | "working" | "distracted" | "sleeping";

type Props = {
  state?: FoxState;
  size?: number;
};

/**
 * Stand-in fennec fox until the Rive animation is ready. Uses simple SVG
 * shapes plus Moti to convey state — ear wiggle on idle, gentle bob on
 * working, droop on distracted, eyes-closed on sleeping.
 */
export function FoxPlaceholder({ state = "idle", size = 180 }: Props) {
  const earTilt =
    state === "distracted" ? -10 : state === "sleeping" ? -25 : 0;
  const eyeOpen = state !== "sleeping";

  return (
    <MotiView
      from={{ translateY: 0 }}
      animate={{
        translateY:
          state === "working" ? -4 : state === "distracted" ? 6 : 0,
      }}
      transition={{
        type: "timing",
        duration: state === "working" ? 900 : 400,
        loop: state === "working",
      }}
      style={{ width: size, height: size }}
    >
      <Svg viewBox="0 0 200 200" width={size} height={size}>
        {/* Soft ground shadow */}
        <Ellipse
          cx={100}
          cy={175}
          rx={60}
          ry={6}
          fill={palette.ink}
          opacity={0.12}
        />

        {/* Body */}
        <Ellipse cx={100} cy={130} rx={55} ry={42} fill={palette.sand400} />

        {/* Belly */}
        <Ellipse cx={100} cy={140} rx={32} ry={26} fill={palette.sand100} />

        {/* Tail */}
        <Path
          d="M 145 130 Q 175 110 168 90 Q 158 105 150 115 Z"
          fill={palette.sand400}
        />
        <Path
          d="M 165 96 Q 173 90 170 86 Q 162 90 162 94 Z"
          fill={palette.sand50}
        />

        {/* Head */}
        <Ellipse cx={100} cy={90} rx={42} ry={36} fill={palette.sand400} />

        {/* Snout */}
        <Ellipse cx={100} cy={102} rx={22} ry={16} fill={palette.sand100} />

        {/* Ears (the famous fennec ears) */}
        <G rotation={earTilt} originX={75} originY={70}>
          <Path
            d="M 75 70 L 55 20 L 88 50 Z"
            fill={palette.sand400}
          />
          <Path
            d="M 73 60 L 63 30 L 82 50 Z"
            fill={palette.clay500}
            opacity={0.7}
          />
        </G>
        <G rotation={-earTilt} originX={125} originY={70}>
          <Path
            d="M 125 70 L 145 20 L 112 50 Z"
            fill={palette.sand400}
          />
          <Path
            d="M 127 60 L 137 30 L 118 50 Z"
            fill={palette.clay500}
            opacity={0.7}
          />
        </G>

        {/* Eyes */}
        {eyeOpen ? (
          <>
            <Circle cx={86} cy={88} r={4} fill={palette.ink} />
            <Circle cx={114} cy={88} r={4} fill={palette.ink} />
            <Circle cx={87} cy={86} r={1.2} fill={palette.sand50} />
            <Circle cx={115} cy={86} r={1.2} fill={palette.sand50} />
          </>
        ) : (
          <>
            <Path
              d="M 82 88 Q 86 92 90 88"
              stroke={palette.ink}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d="M 110 88 Q 114 92 118 88"
              stroke={palette.ink}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
            />
          </>
        )}

        {/* Nose */}
        <Ellipse cx={100} cy={100} rx={3.5} ry={2.5} fill={palette.ink} />

        {/* Mouth */}
        <Path
          d={
            state === "distracted"
              ? "M 95 110 Q 100 106 105 110"
              : "M 95 108 Q 100 112 105 108"
          }
          stroke={palette.ink}
          strokeWidth={1.5}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    </MotiView>
  );
}
