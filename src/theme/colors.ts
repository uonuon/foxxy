/**
 * Desert-inspired palette. Warm sand + clay daylight tones paired with
 * dusk/night tones for a cozy burrow feel across light and dark modes.
 */
export const palette = {
  sand50: "#fdf9ee",
  sand100: "#f8efd3",
  sand200: "#f4ead1",
  sand300: "#e8d5a0",
  sand400: "#d9b973",
  sand500: "#c89a4d",
  clay500: "#c87244",
  clay600: "#a85a32",
  clay700: "#83441f",
  dusk500: "#5b4a7a",
  dusk700: "#2e2440",
  dusk900: "#181225",
  ink: "#2b1e10",
  inkMuted: "#7a6a55",
  inkSoft: "#b8a88e",
} as const;

export const lightTheme = {
  bg: palette.sand200,
  surface: palette.sand100,
  surfaceElevated: palette.sand50,
  text: palette.ink,
  textMuted: palette.inkMuted,
  accent: palette.clay600,
  accentSoft: palette.clay500,
  border: palette.sand300,
} as const;

export const darkTheme = {
  bg: palette.dusk900,
  surface: palette.dusk700,
  surfaceElevated: palette.dusk500,
  text: palette.sand100,
  textMuted: palette.inkSoft,
  accent: palette.clay500,
  accentSoft: palette.sand400,
  border: palette.dusk500,
} as const;

export type ThemeColors = typeof lightTheme;
