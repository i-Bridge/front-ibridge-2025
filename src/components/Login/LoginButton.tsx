'use client';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <button onClick={() => signOut()}>로그아웃</button>
      </>
    );
  }
  return (
    <>
      <button onClick={() => signIn('google')}>Google로 로그인</button>
    </>
  );
}
