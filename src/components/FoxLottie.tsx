import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";

import type { FoxState } from "./FoxPlaceholder";

/**
 * Each fox state maps to a different Lottie animation file so the fox
 * visually transforms as the user's session progresses.
 */
const ANIMATIONS: Record<FoxState, any> = {
  idle: require("../../assets/lottie/fox-hello.json"),
  working: require("../../assets/lottie/fox-working.json"),
  distracted: require("../../assets/lottie/fox-hello.json"),
  sleeping: require("../../assets/lottie/fox-face.json"),
};

type Props = {
  state?: FoxState;
  size?: number;
};

export function FoxLottie({ state = "idle", size = 200 }: Props) {
  const lottieRef = useRef<LottieView>(null);

  // Reset animation when state changes so the new file starts from frame 0.
  useEffect(() => {
    lottieRef.current?.reset();
    lottieRef.current?.play();
  }, [state]);

  // Slow down the distracted animation to convey sadness.
  const speed = state === "distracted" ? 0.4 : state === "sleeping" ? 0.3 : 1;

  return (
    <View style={{ width: size, height: size }}>
      <LottieView
        ref={lottieRef}
        source={ANIMATIONS[state]}
        autoPlay
        loop
        speed={speed}
        style={{ width: "100%", height: "100%" }}
        resizeMode="contain"
      />
    </View>
  );
}
