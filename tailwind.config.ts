import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./providers/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#f6f0e7",
        paper: "#fbf7f1",
        ink: "#312820",
        clay: "#8a6f5d",
        moss: "#69745f",
        line: "#dccfc1",
        accent: "#ede2d3"
      },
      boxShadow: {
        card: "0 18px 40px rgba(83, 63, 47, 0.08)",
        soft: "0 8px 22px rgba(94, 75, 58, 0.08)"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      maxWidth: {
        reading: "46rem"
      }
    }
  },
  plugins: []
};

export default config;
