import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dojo: {
          black:         "#0b0806",
          "ink-mid":     "#1a1410",
          "ink-lift":    "#251e17",
          gold:          "#c9a227",
          "gold-light":  "#f0d060",
          "gold-dim":    "#7a5f10",
          crimson:       "#b91c1c",
          "crimson-hot": "#ef4444",
          parchment:     "#e8ddc8",
          "parchment-dim": "#a89880",
        },
      },
      fontFamily: {
        display: ["var(--font-cinzel)", "serif"],
        body:    ["var(--font-crimson)", "serif"],
        crimson: ["var(--font-crimson)", "serif"],
      },
      animation: {
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
        shimmer:      "shimmer 4s linear infinite",
        drift:        "drift 6s ease-in-out infinite alternate",
        "fade-up":    "fade-up 0.5s ease forwards",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 12px 2px rgba(185,28,28,0.4)" },
          "50%":       { boxShadow: "0 0 28px 8px rgba(185,28,28,0.7)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition:  "200% center" },
        },
        drift: {
          "0%":   { transform: "translateY(0px) rotate(-1deg)" },
          "100%": { transform: "translateY(-12px) rotate(1deg)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
