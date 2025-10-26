import type { Config } from 'tailwindcss';


export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'tmoney': ['TMoneyDungunbaram', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },

      colors: {
        // --- 브랜드 색상 ---
        // 사용 예: bg-primary-primary
        primary: {
          primary: '#FF6B31', // 기본
          primaryMedium: '#FFD3C1',
          primaryLight: '#FFE9E0',
        },
        secondary: {
          secondary: '#FFDE72',
          secondaryMedium: '#FFF5D5',
          secondaryLight: '#FFFAEA',
        },

        // --- 상태 색상 ---
        // 사용 예: bg-success-successLight
        success: {
          success: '#03B26C',
          successLight: '#D9F3F0',
        },
        error: {
          error: '#FF5E5E',
          errorLight: '#FFE7E7',
        },

        // --- 회색조 (Grayscale) ---
        // 사용 예: bg-grayscale-gray90
        grayscale: {
          gray90: '#191F28',
          gray80: '#333D4B',
          gray70: '#4E5968',
          gray60: '#6B7684',
          gray50: '#8B95A1',
          gray40: '#B0B8C1',
          gray30: '#E2E7EB',
          gray20: '#E2E7EB',
          gray10: '#EEF0F2',
          gray5: '#F9FAFB',
          gray0: '#FFFFFF',
        },

        black: {
          DEFAULT: '#000000',
        },
        white: {
          DEFAULT: '#FFFFFF',
        },

        other: {
          red: {
            DEFAULT: '#FF5E5E',
            light: '#FFE7E7',
          },
          orange: {
            DEFAULT: '#FF7700',
            light: '#FFEBD9',
          },
          yellow: {
            DEFAULT: '#FAB107',
            light: '#FEF3DA',
          },
          skyblue: {
            DEFAULT: '#51C2FF',
            light: '#E5F6FF',
          },
          mint: {
            DEFAULT: '#00B29A',
            light: '#D9F3F0',
          },
          blue: {
            DEFAULT: '#168AFF',
            light: '#DCEDFF',
          },
          purple: {
            DEFAULT: '#595CFF',
            light: '#E6E7FF',
          },
          pink: {
            DEFAULT: '#FF3064',
            light: '#FFE0E8',
          },
          gray: {
            DEFAULT: '#576578',
          light: '#E6E8EB',
            },    
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
