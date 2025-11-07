// src/app/fonts.ts
import localFont from 'next/font/local';

export const nps = localFont({
  src: [
    // 폰트 파일 경로를 로컬 파일 위치에 맞게 수정해주세요.
    {
      path: '../../public/fonts/NPSfontRegular.woff2', // 400 (normal)
      weight: '400',
      style: 'normal',
    },
  ],
  display: 'swap', // FOUT 최소화 (권장)
  variable: '--font-nps', // Tailwind CSS에서 사용할 CSS 변수 이름
});