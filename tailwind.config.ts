import type { Config } from "tailwindcss";
import baseColors from "./config/theme/baseColors";
import themeColors from "./config/theme/themeColors";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./containers/**/*.{ts,tsx}",
    "./providers/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ...baseColors,
        ...themeColors,
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        "ar-sans": ["Cairo", "sans-serif"],
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
