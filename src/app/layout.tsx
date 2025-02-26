'use client';

import './globals.css';
import { SessionProvider } from 'next-auth/react';

import { Noto_Sans_KR } from 'next/font/google';

const notoSansKR = Noto_Sans_KR({
  weight: ['100', '300', '500', '700', '900'], // 사용할 폰트 굵기 설정
  display: 'swap', // 폰트 로딩 방식 설정
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={notoSansKR.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
