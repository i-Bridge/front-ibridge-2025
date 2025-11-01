'use client';

import { signOut } from 'next-auth/react';
import { ReactNode } from 'react';
import { Button } from '@/ui/Button';

export const handleLogout = async () => {
  sessionStorage.clear();
  localStorage.clear();
  await signOut({ callbackUrl: '/' });
};

interface LogoutButtonProps {
  children: ReactNode;
  className?: string;
  textVariant?: string;
}

export default function LogoutButton({
  children,
  className = '',
  textVariant = '',
}: LogoutButtonProps) {
  return (
    <Button variant="grayscale" onClick={handleLogout} className={className} textVariant={textVariant} >
      {children}
    </Button>
  );
}
