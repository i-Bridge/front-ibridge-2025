'use client';

import { signOut } from 'next-auth/react';

export const handleLogout = async () => {
  document.cookie = 'email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

  sessionStorage.clear();
  localStorage.clear();
  await signOut({ callbackUrl: '/' });
};

export default function LogoutButton() {
  return (
    <button
      onClick={handleLogout}
      className="w-full py-2 px-4  bg-i-lightpurple text-white font-semibold rounded-lg  shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-i-pink focus:ring-opacity-75"
    >
      로그아웃
    </button>
  );
}
