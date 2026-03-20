import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        neu: {
          bg: '#e0e5ec',
          surface: '#e0e5ec',
          text: '#6b7280',
          'text-dark': '#374151',
          accent: '#a78bfa',
          'accent-soft': '#c4b5fd',
          rose: '#f472b6',
          'rose-soft': '#fbcfe8',
        },
      },
      boxShadow: {
        'neu-flat': '6px 6px 12px #b8bec7, -6px -6px 12px #ffffff',
        'neu-pressed': 'inset 4px 4px 8px #b8bec7, inset -4px -4px 8px #ffffff',
        'neu-sm': '3px 3px 6px #b8bec7, -3px -3px 6px #ffffff',
        'neu-btn': '4px 4px 8px #b8bec7, -4px -4px 8px #ffffff',
        'neu-btn-pressed': 'inset 3px 3px 6px #b8bec7, inset -3px -3px 6px #ffffff',
      },
    },
  },
  plugins: [],
};
export default config;
