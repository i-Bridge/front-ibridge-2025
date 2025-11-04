import type { Metadata } from 'next';
import './globals.css';
import Providers from './Providers';
import { tmoney } from '@/lib/font';

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
    <html lang="ko" className={`${tmoney.variable} font-tmoney`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
