import type { Config } from "tailwindcss"

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // extend: {
  //   colors: {
  //     background: "var(--background)",
  //     foreground: "var(--foreground)",
  //   },
  // },
  plugins: [require("daisyui")],
  // daisyui: {
  //   themes: [
  //     {
  //       "gg-light": {
  //         primary: "#0D8EF2",
  //         secondary: "#F2710D",
  //         accent: "#00ffff",
  //         neutral: "#0D8EF2",
  //         "base-100": "#fcfbf7",
  //         "base-content": "#1f2937",
  //         info: "#0017db",
  //         success: "#1CF20D",
  //         warning: "#fde047",
  //         error: "#ff0000",
  //       },
  //     },
  //   ],
  // },
} satisfies Config
