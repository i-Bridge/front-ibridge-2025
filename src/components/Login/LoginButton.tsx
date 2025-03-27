'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import axiosInstance from '@/lib/axiosInstance';
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
        {/* Google 로그인 버튼 */}
        <button
          onClick={() => signIn('google')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '10px 20px',
            backgroundColor: '#fff',
            color: '#5F6368',
            border: '1px solid #dadce0',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="20"
            height="20"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            ></path>
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            ></path>
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            ></path>
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            ></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
          <span>Google로 로그인</span>
        </button>

        {/* Naver 로그인 버튼 */}
        <button
          onClick={() => signIn('naver')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '10px 20px',
            backgroundColor: '#03C75A',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              fill="#fff"
              d="M4 4h4.667l5.333 7.467V4H20v16h-4.667l-5.333-7.467V20H4V4Z"
            />
          </svg>
          <span>Naver로 로그인</span>
        </button>
      </div>
    </>
  );
}
