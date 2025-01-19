import type { Config } from "tailwindcss";
import icons from "rocketicons/tailwind";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'hkust-blue': '#003366',
        'hkust-gold': '#996600',
        'hkust-white': '#ffffff',
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    icons
  ],
};
export default config;
