'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';
import type { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Toaster position="top-center" richColors /> {children}
    </SessionProvider>
  );
}
