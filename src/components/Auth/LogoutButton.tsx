'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  const handleLogout = async () => {
    sessionStorage.clear();
    localStorage.clear();
    await signOut({ callbackUrl: '/' });
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: '10px 20px',
        backgroundColor: '#DB4437',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      로그아웃
    </button>
  );
}
