import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-nanum)', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },

      //light는 DEFAULT의 15% 투명도이므로 DEFAULT/15로 사용
      colors: {

        // --- 브랜드 색상 ---
        // 사용 예: bg-primary, text-secondary/30, border-tertiary-light
        // primary100: 100%, primaryMedium: 30%, primaryLight: 15% opacity
        Primary: {
          DEFAULT: '#FF6B31', 
        },
        Secondary: {
          DEFAULT: '#FFDE72',
        },
        Tertiary: {
          DEFAULT: '#7D4B37',
        },

        // --- 상태 색상 ---
        // 사용 예: bg-success, text-error-light
        // success: 100%, successLight: 10% opacity
        // error: 100%, errorLight: 10% opacity
        Success: {
          DEFAULT: '#00B29A',
        },
        Error: {
          DEFAULT: '#FF5E5E',
        },

        // ---  검/흰  ---
        // 사용 예: bg-Black/90, text-White/10
        // 90, 80, 70, ..., 10, 5% opacity
        Black: {
          DEFAULT: '#000000',
        },
        White: {
          DEFAULT: '#FFFFFF',
        },

        // --- 회색조 ---
        // 사용 예: bg-Grayscale-gray90, text-Grayscale-gray50, border-Grayscale-gray10
        Grayscale: {
          gray90: '#191F28',
          gray80: '#333D4B',
          gray70: '#4E5968',
          gray60: '#6B7684',
          gray50: '#8B95A1',
          gray30: '#E2E7EB',
          gray10: '#EEF0F2',
          gray5: '#F9FAFB',
          gray0: '#FFFFFF',
        },

        // --- 기타 색상 ---
        'i-orange': '#FF662D',
        'i-skyblue': '#57b5ce',
        'i-mint': '#C4E1C5',
        'i-lightorange': '#F4A259 ',
        'i-yellow': '#FDD504',
        'i-ivory': '#FFedd5',
        'i-lightgreen': '#b2e04d',
        'i-lightpurple': '#F1D1EC',
        'i-pink': '#FFB1D0',
        'i-darkblue': '#034892',
        'i-lightgray': '#D9D9D9',
        'i-black': '#202123',
        'i-white': '#FFFFF',
      },
    },
  },
  plugins: [],
} satisfies Config;
