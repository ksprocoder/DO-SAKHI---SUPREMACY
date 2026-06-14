import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ds: {
          ivory: "#F8F3EA",
          warmWhite: "#FFFDF8",
          emerald: "#073F34",
          deepForest: "#022B24",
          softSage: "#DDE7DC",
          mutedSage: "#B8C9BC",
          copper: "#A76F4D",
          roseGold: "#B98976",
          charcoal: "#1D1D1B",
          mutedText: "#6E675F",
          border: "#E8DED2",
          error: "#8A2F24",
          success: "#315C48"
        }
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"]
      }
    },
  },
  plugins: [],
};

export default config;
