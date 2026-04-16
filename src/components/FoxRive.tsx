import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import Rive, {
  Alignment,
  Fit,
  type RiveRef,
} from "rive-react-native";

import foxFile from "../../assets/rive/fox-girl.riv";
import type { FoxState } from "./FoxPlaceholder";

type Props = {
  state?: FoxState;
  size?: number;
};

/**
 * State machine name in the .riv file. Common defaults are "State Machine 1"
 * or a custom name set in Rive editor. If the bundled .riv ever changes, you
 * may need to inspect it in Rive and update this.
 */
const STATE_MACHINE = "State Machine 1";

/**
 * Boolean input on the state machine that toggles the "distracted/sad"
 * variant of the idle pose. The provided fox file uses an `idle-fail`
 * animation; if the input name differs, update here.
 */
const FAIL_INPUT = "fail";

/**
 * Wraps the Rive fennec fox. Reacts to FoxState by toggling the `fail`
 * boolean on the state machine. Falls through silently if the input or
 * state machine isn't present so the screen never crashes — the visible
 * default is whatever the editor configured as the entry state.
 */
export function FoxRive({ state = "idle", size = 200 }: Props) {
  const riveRef = useRef<RiveRef>(null);

  useEffect(() => {
    if (!riveRef.current) return;
    const failing = state === "distracted" || state === "sleeping";
    try {
      riveRef.current.setInputState(STATE_MACHINE, FAIL_INPUT, failing);
    } catch {
      // input doesn't exist in this build of the .riv — ignore quietly.
    }
  }, [state]);

  return (
    <View style={{ width: size, height: size }}>
      <Rive
        ref={riveRef}
        source={foxFile}
        stateMachineName={STATE_MACHINE}
        autoplay
        fit={Fit.Contain}
        alignment={Alignment.Center}
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
}
