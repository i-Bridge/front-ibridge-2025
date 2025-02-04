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
        'i-red': '#ff5d21', //기본
        'i-skyblue': '#57B5CE',
        'i-yellow': '#FDD504',
        'i-ivory': '#Fff6ef', //배경
        'i-lightgreen': '#C3E93F',
        'i-lightpurple': '#F1D1EC',
        'i-pink': '#FFB1D0',
        'i-darkblue': '#034892', //기본
        'i-lightgrey': '#D9D9D9',
        'i-black': '#202123',
      },
    },
  },
  plugins: [],
} satisfies Config;
