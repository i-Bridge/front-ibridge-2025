import type { Metadata } from 'next';
import './globals.css';
import Providers from './Providers';
import { nps } from '@/lib/font';

export const metadata: Metadata = {
  title: 'i-Bridge',
  description: 'AI 대화 서비스',
};

export default function RootLayout({
  children,
}: Readonly<{ 
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={nps.variable}>
      <body className="font-nps min-w-[375px]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
