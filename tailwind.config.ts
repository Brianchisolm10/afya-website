import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  // Safelist only dynamically generated classes that PurgeCSS can't detect
  safelist: [
    // Tool card gradients (dynamically applied)
    'from-teal-500', 'to-cyan-600',
    'from-purple-500', 'to-indigo-600',
    'from-blue-500', 'to-teal-600',
    'from-rose-500', 'to-pink-600',
    'from-violet-500', 'to-purple-600',
    'from-emerald-500', 'to-teal-600',
    'bg-gradient-to-br', 'bg-gradient-to-r',
  ],
  theme: {
    extend: {
      colors: {
        afya: {
          primary: "#00CED1", // Vibrant Cyan/Turquoise
          "primary-light": "#5FD4D6", // Light Cyan
          "primary-dark": "#00A8AA", // Dark Cyan
          secondary: "#FF1493", // Hot Pink/Magenta
          "secondary-light": "#FF69B4", // Hot Pink Light
          "secondary-dark": "#C71585", // Medium Violet Red
          accent: "#2C1B47", // Deep Navy/Purple
          "accent-light": "#4A148C", // Purple Accent
          "accent-dark": "#1A0B2E", // Very Dark Purple
          navy: "#2C1B47", // Deep Navy for text/weights
          pink: "#FF1493", // Hot Pink
          cyan: "#00CED1", // Cyan
          lime: "#ADFF2F", // Lime accent
          peach: "#FFB6C1", // Peach/Coral skin tones
          periwinkle: "#B0C4DE", // Light blue backgrounds
          cream: "#F5E6D3", // Warm beige backgrounds
          dark: "#1f2937",
          light: "#f9fafb",
        },
        coral: {
          400: "#FFB6C1", // Light Coral/Peach
          500: "#FFA07A", // Light Salmon
          600: "#FF7F50", // Coral
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
