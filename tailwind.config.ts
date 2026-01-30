import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#0F2A44",
        secondary: "#F5EFE6",
        accent: "#1DBF73",
        dark: "#0B1320",
        light: "#FAFAFA",
      },
    },
  },

  plugins: [],
};

export default config;
