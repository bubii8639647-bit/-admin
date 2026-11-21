import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          emerald: "#10b981",
          cyan: "#06b6d4",
          purple: "#8b5cf6",
        },
      },
    },
  },
  plugins: [],
};
export default config;
