import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // NEXUS Design Tokens
      colors: {
        void:    "#070810",
        deep:    "#0c0f1a",
        panel:   "#111625",
        card:    "#161c2e",
        hover:   "#1d2540",
        blue:    "#63b3ed",
        gold:    "#f6c90e",
        green:   "#48bb78",
        red:     "#fc5c5c",
        purple:  "#9f7aea",
        cyan:    "#4fd1c5",
      },
      fontFamily: {
        sans:  ["Syne", "sans-serif"],
        mono:  ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}

export default config
