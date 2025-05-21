'use client';

import { signOut } from 'next-auth/react';
import { ReactNode } from 'react';

export const handleLogout = async () => {
  sessionStorage.clear();
  localStorage.clear();
  await signOut({ callbackUrl: '/' });
};

interface LogoutButtonProps {
  children: ReactNode;
  className?: string;
}

export default function LogoutButton({ children, className = '' }: LogoutButtonProps) {
  return (
    <button onClick={handleLogout} className={className}>
      {children}
    </button>
  );
}
