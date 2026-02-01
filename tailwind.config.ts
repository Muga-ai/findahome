import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F2A44",
        secondary: "#C9A24D",
        accent: "#2563EB",
        dark: "#0B1623",
        light: "#F8FAFC",
      },
    },
  },
  plugins: [],
};

export default config;
