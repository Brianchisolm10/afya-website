import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        afya: {
          primary: "#40E0D0", // True Turquoise
          "primary-light": "#7FFFD4", // Aquamarine
          "primary-dark": "#20B2AA", // Light Sea Green
          secondary: "#9370DB", // Medium Purple/Lavender
          "secondary-light": "#DDA0DD", // Plum
          "secondary-dark": "#8A2BE2", // Blue Violet
          accent: "#6b7280", // Grey accent
          "accent-light": "#9ca3af",
          "accent-dark": "#4b5563",
          dark: "#1f2937",
          light: "#f9fafb",
        },
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        fadeIn: 'fadeIn 0.3s ease-in-out',
        slideUp: 'slideUp 0.3s ease-out',
        slideDown: 'slideDown 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
export default config;
