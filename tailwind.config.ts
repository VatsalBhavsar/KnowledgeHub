import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class', // ✅ Enables class-based dark mode
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      transitionProperty: {
        'theme': 'background-color, border-color, color, fill, stroke',
      },
    }
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;

