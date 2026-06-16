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
        canvas: "#050505",
        paper: "#fffffc",
        ink: "#171717",
        clay: "#70706b",
        moss: "#5bbeb2",
        line: "#e7e7df",
        accent: "#eef8f6"
      },
      boxShadow: {
        card: "0 18px 45px rgba(28, 28, 24, 0.06)",
        soft: "0 10px 30px rgba(28, 28, 24, 0.05)"
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
