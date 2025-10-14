import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },

      //light는 DEFAULT의 15% 투명도이므로 DEFAULT/15로 사용
      colors: {
        // --- 브랜드 색상 ---
        // 사용 예: bg-primary, text-secondary, border-tertiary-light
        primary: {
          DEFAULT: '#FF6B31', // 기본 Primary 색상
        },
        secondary: {
          DEFAULT: '#FFDE72',
        },
        tertiary: {
          DEFAULT: '#7D4B37',
        },

        // --- 상태 색상 ---
        // 사용 예: bg-success, text-error-light
        success: {
          DEFAULT: '#03B26C',
        },
        error: {
          DEFAULT: '#FF5E5E',
        },

        // --- 회색조 (Grayscale) ---
        // 사용 예: bg-gray-900, text-gray-500, border-gray-100
        gray: {
          90: '#191F28',
          80: '#333D4B',
          70: '#4E5968',
          60: '#6B7684',
          50: '#8B95A1',
          30: '#E2E7EB',
          10: '#EEF0F2',
          5: '#F9FAFB',
          0: '#FFFFFF',
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
      fontFamily: {
        noto: 'var(--font-noto)',
      },
    },
  },
  plugins: [],
} satisfies Config;
