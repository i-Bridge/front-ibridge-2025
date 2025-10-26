'use client';

import { signOut } from 'next-auth/react';
import { ReactNode } from 'react';
import { Button } from '@/components/UI/Button';

export const handleLogout = async () => {
  sessionStorage.clear();
  localStorage.clear();
  await signOut({ callbackUrl: '/' });
};

interface LogoutButtonProps {
  children: ReactNode;
  className?: string;
}


export default function LogoutButton({
  children,
  className = '',
}: LogoutButtonProps) {

  return (
    <Button variant="grayscale" onClick={handleLogout} className={className}>
      {children}
    </Button>
  );
}
