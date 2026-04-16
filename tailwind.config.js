/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter_400Regular"],
        "inter-medium": ["Inter_500Medium"],
        "inter-semibold": ["Inter_600SemiBold"],
        "inter-bold": ["Inter_700Bold"],
        cairo: ["Cairo_400Regular"],
        "cairo-medium": ["Cairo_500Medium"],
        "cairo-semibold": ["Cairo_600SemiBold"],
        "cairo-bold": ["Cairo_700Bold"],
      },
      colors: {
        // Warm desert palette — sand, clay, terracotta, dusk
        sand: {
          50: "#fdf9ee",
          100: "#f8efd3",
          200: "#f4ead1",
          300: "#e8d5a0",
          400: "#d9b973",
          500: "#c89a4d",
        },
        clay: {
          500: "#c87244",
          600: "#a85a32",
          700: "#83441f",
        },
        dusk: {
          500: "#5b4a7a",
          700: "#2e2440",
          900: "#181225",
        },
        ink: {
          DEFAULT: "#2b1e10",
          muted: "#7a6a55",
          soft: "#b8a88e",
        },
      },
    },
  },
  plugins: [],
};
