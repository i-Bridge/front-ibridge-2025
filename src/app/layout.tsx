'use client';

import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="ko">
      <body>
          <SessionProvider>
            <Toaster position="top-center" richColors />
            {children}
          </SessionProvider>
      </body>
    </html>
  );
}
