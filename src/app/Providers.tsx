// app/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';
import type { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Toaster 
        position="bottom-center" 
        richColors 
        duration={2500} 
      />
      {children}
    </SessionProvider>
  );
}