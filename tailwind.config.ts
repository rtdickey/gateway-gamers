import type { Config } from "tailwindcss"

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        "gg-light": {
          primary: "#0D8EF2",
          "primary-content": "#ffffff",
          secondary: "#F2710D",
          "secondary-content": "#ffffff",
          accent: "#F5A623",
          "accent-content": "#1f2937",
          neutral: "#374151",
          "neutral-content": "#f9fafb",
          "base-100": "#fafaf9",
          "base-200": "#f3f4f6",
          "base-300": "#e5e7eb",
          "base-content": "#1f2937",
          info: "#3b82f6",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
      {
        "gg-dark": {
          primary: "#38BEFF",
          "primary-content": "#0a1929",
          secondary: "#FF8C42",
          "secondary-content": "#1a0a00",
          accent: "#F5A623",
          "accent-content": "#1a0a00",
          neutral: "#1e293b",
          "neutral-content": "#e2e8f0",
          "base-100": "#1a1f2e",
          "base-200": "#151a27",
          "base-300": "#0f1420",
          "base-content": "#e2e8f0",
          info: "#60a5fa",
          success: "#4ade80",
          warning: "#fbbf24",
          error: "#f87171",
        },
      },
    ],
  },
} satisfies Config
