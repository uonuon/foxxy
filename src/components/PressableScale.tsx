import React, { useCallback } from "react";
import { Pressable, type PressableProps } from "react-native";
import { MotiView } from "moti";
import * as Haptics from "expo-haptics";

type Props = PressableProps & {
  haptic?: boolean;
  scale?: number;
  children: React.ReactNode;
};

/**
 * Pressable wrapper with a subtle scale + optional haptic. Used for primary
 * CTAs to give buttons a satisfying tactile feel without a heavy lib.
 */
export function PressableScale({
  haptic = true,
  scale = 0.96,
  onPressIn,
  onPressOut,
  onPress,
  children,
  style,
  ...rest
}: Props) {
  const [pressed, setPressed] = React.useState(false);

  const handlePressIn = useCallback(
    (e: any) => {
      setPressed(true);
      onPressIn?.(e);
    },
    [onPressIn],
  );

  const handlePressOut = useCallback(
    (e: any) => {
      setPressed(false);
      onPressOut?.(e);
    },
    [onPressOut],
  );

  const handlePress = useCallback(
    (e: any) => {
      if (haptic) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
          // ignore haptic errors silently
        });
      }
      onPress?.(e);
    },
    [haptic, onPress],
  );

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={style}
      {...rest}
    >
      <MotiView
        animate={{ scale: pressed ? scale : 1 }}
        transition={{ type: "timing", duration: 120 }}
      >
        {children}
      </MotiView>
    </Pressable>
  );
}
