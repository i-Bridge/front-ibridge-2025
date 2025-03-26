'use client';

import './globals.css';
import { SessionProvider } from 'next-auth/react';
import ParentHeader from '@/components/Header/ParentHeader';
import { HeaderContextProvider } from '@/context/HeaderContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <SessionProvider>
          <HeaderContextProvider>
            <ParentHeader />
            {children}
          </HeaderContextProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
