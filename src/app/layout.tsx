'use client';

import './globals.css';
import { SessionProvider } from 'next-auth/react';
import ParentHeader from '@/components/Header/ParentHeader';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <SessionProvider>
          <ParentHeader />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
