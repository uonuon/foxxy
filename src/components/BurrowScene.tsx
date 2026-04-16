import React from "react";
import { View } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Rect, Path } from "react-native-svg";

import { FoxPlaceholder, type FoxState } from "./FoxPlaceholder";
import { palette } from "@/theme/colors";

type Props = {
  state?: FoxState;
  height?: number;
};

/**
 * A simple desert burrow backdrop. Layered SVG: sky gradient, distant dunes,
 * burrow opening, then the fox composited on top. Decorations layer comes
 * later once the shop is wired up.
 */
export function BurrowScene({ state = "idle", height = 320 }: Props) {
  return (
    <View style={{ height, width: "100%", position: "relative" }}>
      <Svg viewBox="0 0 400 320" width="100%" height={height}>
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={palette.sand100} />
            <Stop offset="1" stopColor={palette.sand300} />
          </LinearGradient>
          <LinearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={palette.sand400} />
            <Stop offset="1" stopColor={palette.clay500} />
          </LinearGradient>
        </Defs>

        {/* Sky */}
        <Rect x={0} y={0} width={400} height={220} fill="url(#sky)" />

        {/* Far dunes */}
        <Path
          d="M 0 200 Q 80 170 160 195 T 320 190 T 400 200 L 400 240 L 0 240 Z"
          fill={palette.sand300}
          opacity={0.9}
        />

        {/* Closer dunes */}
        <Path
          d="M 0 230 Q 100 200 200 225 T 400 220 L 400 260 L 0 260 Z"
          fill={palette.sand400}
        />

        {/* Ground */}
        <Rect x={0} y={250} width={400} height={70} fill="url(#ground)" />

        {/* Burrow opening */}
        <Path
          d="M 130 260 Q 200 200 270 260 L 270 320 L 130 320 Z"
          fill={palette.dusk900}
          opacity={0.85}
        />
        <Path
          d="M 145 263 Q 200 215 255 263"
          stroke={palette.clay700}
          strokeWidth={3}
          fill="none"
        />
      </Svg>

      {/* Fox sits at burrow entrance */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          bottom: 24,
          left: 0,
          right: 0,
          alignItems: "center",
        }}
      >
        <FoxPlaceholder state={state} size={200} />
      </View>
    </View>
  );
}
