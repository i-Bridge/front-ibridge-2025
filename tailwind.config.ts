import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'i-orange': '#FF662D',
        'i-skyblue': '#B6D7A8 ',
        'i-mint':'#C4E1C5',
        'i-lightorange':'#F4A259 ',
        'i-yellow': '#FDD504',
        'i-ivory': '#FFedd5',
        'i-lightgreen': '#b2e04d',
        'i-lightpurple': '#F1D1EC',
        'i-pink': '#FFB1D0',
        'i-darkblue': '#034892',
        'i-lightgray': '#D9D9D9',
        'i-black': '#202123',
        'i-white':'#FFFFF',
      },
      fontFamily: {
        noto: 'var(--font-noto)', 
      },
    },
  },
  plugins: [],
} satisfies Config;
