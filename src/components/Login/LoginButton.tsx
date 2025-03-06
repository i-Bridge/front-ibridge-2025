'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import axiosInstance from '@/api/index';
import { useEffect } from 'react';

export default function LoginButton() {
  const { data: session } = useSession(); // 세션 정보를 가져옴

  useEffect(() => {
    if (session?.user) {
      sendUserDataToBackend({
        name: session.user.name ?? undefined, // null 값 방지
        email: session.user.email ?? undefined,
      });
    }
  }, [session]);

  const sendUserDataToBackend = async (user: {
    name?: string;
    email?: string;
  }) => {
    try {
      await axiosInstance.post('/start/signin', {
        name: user.name,
        email: user.email,
      });
      console.log(axiosInstance.defaults.baseURL);

      console.log('사용자 정보 백엔드 전송 성공');
    } catch (error) {
      console.log(axiosInstance.defaults.baseURL);

      console.error('사용자 정보 전송 실패:', error);
    }
  };

  if (session) {
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

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
