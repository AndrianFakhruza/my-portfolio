import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // User requested palette:
        // #F59E0B (Amber Gold)
        // #18181B (Dark Charcoal / Zinc 900)
        // #F8F8F8 (Off-White Base / Zinc 50)
        brand: {
          amber: "#F59E0B",
          dark:  "#18181B",
          light: "#F8F8F8",
        },
        accent: {
          50:  "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B", // Primary brand amber
          600: "#D97706", // Hover
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        paper: {
          50:  "#F8F8F8", // User requested light background
          100: "#F4F4F5",
          200: "#E4E4E7",
          300: "#D4D4D8",
          400: "#A1A1AA",
          500: "#71717A",
          600: "#52525B",
          700: "#3F3F46",
          800: "#27272A",
          900: "#18181B", // User requested dark background
          950: "#09090B",
        },
      },
      fontFamily: {
        sans:    ["var(--font-roboto-slab)", "var(--font-geist)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-roboto-slab)", "serif"],
        mono:    ["var(--font-space-mono)", "monospace"],
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
        "4xl": "2.25rem",
      },
      boxShadow: {
        soft:         "0 8px 30px rgba(0,0,0,0.04)",
        card:         "0 4px 24px -4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)",
        "card-hover": "0 20px 48px -8px rgba(245,158,11,0.15), 0 0 0 1px rgba(245,158,11,0.22)",
        glow:         "0 0 40px -10px rgba(245,158,11,0.35)",
      },
      animation: {
        "marquee":     "marquee 35s linear infinite",
        "pulse-slow":  "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float":       "float 5s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%":   { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
