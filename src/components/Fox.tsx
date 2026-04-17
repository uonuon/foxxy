import React from "react";

import { FoxPlaceholder, type FoxState } from "./FoxPlaceholder";
import { FoxLottie } from "./FoxLottie";

export type { FoxState };

type Props = {
  state?: FoxState;
  size?: number;
};

type FoxEngine = "lottie" | "svg";

/**
 * Toggle between the Lottie character and the SVG placeholder.
 * Set to "svg" if you ever need to debug layout without Lottie
 * (e.g. snapshot tests, stripped-down screens).
 */
const ENGINE: FoxEngine = "lottie";

export function Fox({ state = "idle", size = 200 }: Props) {
  if (ENGINE === "lottie") {
    return <FoxLottie state={state} size={size} />;
  }
  return <FoxPlaceholder state={state} size={size} />;
}
