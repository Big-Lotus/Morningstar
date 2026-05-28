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
        canvas: "#f8efe0",
        paper: "#fffaf1",
        ink: "#1f1a16",
        clay: "#7f6a57",
        moss: "#e57945",
        line: "#ead8c2",
        accent: "#f4dfc7"
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
