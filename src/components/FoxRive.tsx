import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import Rive, {
  Alignment,
  Fit,
  type RiveRef,
} from "rive-react-native";

import foxFile from "../../assets/rive/fox-girl.riv";
import { FoxPlaceholder, type FoxState } from "./FoxPlaceholder";

type Props = {
  state?: FoxState;
  size?: number;
};

/**
 * State machine name as authored in fox-girl.riv (see Rive editor's
 * Animations panel). The boolean input name is a best guess — verify in
 * the editor's State Machine inspector and update if needed. If the
 * input doesn't exist, the setInputState call no-ops (try/catch below).
 */
const STATE_MACHINE: string | undefined = "State machine";
const FAIL_INPUT = "fail";

/**
 * Wraps the Rive fox character. Hardened with an error fallback so a
 * malformed or missing state-machine name can never crash the screen —
 * we render the SVG placeholder instead.
 *
 * Note: Rive's iOS runtime calls `fatalError` in Swift when it can't find
 * a requested artboard or state machine. The `onError` handler here will
 * not catch those (they happen on a background queue and trap before
 * delegating). The safe pattern is to simply NOT pass a state-machine
 * name unless you've verified it exists in the file.
 */
export function FoxRive({ state = "idle", size = 200 }: Props) {
  const riveRef = useRef<RiveRef>(null);
  const [failed, setFailed] = useState(false);

  // If we have a confirmed state-machine name, attempt to flip its `fail`
  // boolean as FoxState changes. Wrapped in try/catch because the input
  // may not exist even if the state machine does.
  useEffect(() => {
    if (!STATE_MACHINE || !riveRef.current) return;
    const failing = state === "distracted" || state === "sleeping";
    try {
      riveRef.current.setInputState(STATE_MACHINE, FAIL_INPUT, failing);
    } catch {
      // Input doesn't exist — silently no-op.
    }
  }, [state]);

  if (failed) {
    return <FoxPlaceholder state={state} size={size} />;
  }

  return (
    <View style={{ width: size, height: size }}>
      <Rive
        ref={riveRef}
        source={foxFile}
        {...(STATE_MACHINE ? { stateMachineName: STATE_MACHINE } : {})}
        autoplay
        fit={Fit.Contain}
        alignment={Alignment.Center}
        onError={(err) => {
          // Falls back to SVG fox if Rive can't load the file or finds
          // the requested state machine missing.
          if (__DEV__) {
            console.warn("[FoxRive] error, falling back to SVG:", err);
          }
          setFailed(true);
        }}
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
}
