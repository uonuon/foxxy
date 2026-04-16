import React from "react";

import { FoxPlaceholder, type FoxState } from "./FoxPlaceholder";
import { FoxRive } from "./FoxRive";

export type { FoxState };

type Props = {
  state?: FoxState;
  size?: number;
};

/**
 * Toggle between the production Rive character and the SVG placeholder.
 * Set USE_RIVE=false if you ever need to debug layout without loading the
 * Rive runtime (e.g. snapshot tests, stripped-down screens).
 */
const USE_RIVE = true;

export function Fox({ state = "idle", size = 200 }: Props) {
  if (USE_RIVE) {
    return <FoxRive state={state} size={size} />;
  }
  return <FoxPlaceholder state={state} size={size} />;
}
