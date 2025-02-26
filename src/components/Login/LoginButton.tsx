'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function LoginButton() {
  const { data: session } = useSession(); // 세션 정보를 가져옴

  if (session) {
    // 로그인된 경우
    return (
      <>
        <p>Welcome, {session.user?.name}!</p>
        <button
          onClick={() => signOut()}
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
      </>
    );
  }

  // 로그인되지 않은 경우
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Google 로그인 버튼 */}
        <button
          onClick={() => signIn('google')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4285F4',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Google로 로그인
        </button>

        {/* Kakao 로그인 버튼 */}
        <button
          onClick={() => signIn('kakao')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#FEE500',
            color: '#000',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Kakao로 로그인
        </button>

        {/* Naver 로그인 버튼 */}
        <button
          onClick={() => signIn('naver')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#03C75A',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Naver로 로그인
        </button>
      </div>
    </>
  );
}
