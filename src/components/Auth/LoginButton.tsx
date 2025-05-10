'use client';

import { signIn, useSession } from 'next-auth/react';
import { Fetcher } from '@/lib/fetcher';
import { useEffect, useState } from 'react';
import LogoutButton from './LogoutButton';
import { useRouter } from 'next/navigation';

export default function LoginButton() {
  const { data: session } = useSession();
  const router = useRouter();
  const [status, setStatus] = useState<
    'idle' | 'checking' | 'firstLogin' | 'waiting' | 'enterFamilyName' | 'done'
  >('idle');
  const [familyName, setFamilyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [familyError, setFamilyError] = useState<string | null>(null);

  // 🔐 Refresh 실패 대응
  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
      router.push('/');
    }
  }, [session?.error]);

  // ✅ 로그인 후 유저 정보 백엔드 전송
  useEffect(() => {
    if (!session?.user || !session?.accessToken || status !== 'idle') return;

    sendUserDataToBackend();
  }, [session, status]);

  // 🐞 디버깅용 accessToken 로그 (선택)
  useEffect(() => {
    if (session?.accessToken) {
      console.log('🔐 accessToken:', session.accessToken);
    }
  }, [session?.accessToken]);

  const sendUserDataToBackend = async () => {
    setStatus('checking');
    try {
      const encodedName = session?.user?.name
        ? Buffer.from(session.user.name, 'utf-8').toString('base64')
        : '';

      const signinRes = await Fetcher<{ first: boolean }>('/start/signin', {
        method: 'POST',
        data: {
          email: session?.user?.email,
          name: encodedName, // ✅ 인코딩된 name만 전달
        },
      });

      const first = signinRes?.data?.first;
      if (first) {
        alert('회원가입되었습니다. 처음 만나서 반가워요.');
        setStatus('firstLogin');
        return;
      }

      const loginRes = await Fetcher<{
        accepted: boolean;
        send: boolean;
        familyName: string;
        children: { id: number; name: string; birth: string; gender: number }[];
      }>('/start/login');

      const loginData = loginRes?.data;

      if (loginData?.accepted) {
        router.push('/profile');
      } else {
        if (loginData?.send) {
          setStatus('waiting');
        } else {
          setStatus('firstLogin');
        }
      }
    } catch (error) {
      console.error('❌ 사용자 정보 전송 실패:', error);
    }
  };

  const handleSubmitFamily = async () => {
    if (!familyName) return alert('가족 이름을 입력해주세요!');
    if (loading) return;

    setLoading(true);
    setFamilyError(null);

    try {
      const res = await Fetcher<{ exist: boolean }>('/start/signup/exist', {
        method: 'POST',
        data: { familyName },
      });

      if (!res?.data?.exist) {
        setFamilyError('❗ 존재하지 않는 가족 이름입니다. 다시 입력하세요.');
        return;
      }

      setFamilyName('');
      setStatus('waiting');
    } catch (err) {
      console.error('❌ 가족 이름 등록 실패:', err);
      alert('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (session) {
    return (
      <>
        <p>{session.user?.name}님 반가워요!</p>

        {status === 'firstLogin' && (
          <div className="mt-4 p-4 border rounded-xl shadow-sm bg-white max-w-md">
            <p className="text-lg font-semibold mb-4 text-gray-800">
              🧩 기존 가족이 있나요?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setStatus('enterFamilyName')}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                O
              </button>
              <button
                onClick={() => router.push('/setup')}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                X
              </button>
            </div>
          </div>
        )}

        {status === 'enterFamilyName' && (
          <div className="mt-4 p-4 border rounded-xl shadow-sm bg-white w-full max-w-sm">
            <p className="text-lg font-semibold mb-2 text-gray-800">
              👨‍👩‍👧 가족 이름을 입력해주세요:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="가족 이름"
                value={familyName}
                onChange={(e) => {
                  setFamilyName(e.target.value);
                  setFamilyError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmitFamily();
                }}
                className="w-48 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={handleSubmitFamily}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition whitespace-nowrap"
              >
                확인
              </button>
            </div>
            {familyError && (
              <p className="mt-2 text-sm text-red-500">{familyError}</p>
            )}
          </div>
        )}

        {status === 'waiting' && (
          <div className="mt-4 p-4 border rounded-xl shadow-sm bg-yellow-50 text-gray-800">
            <p>⏳ 수락 요청 중입니다...</p>
          </div>
        )}

        <LogoutButton />
      </>
    );
  }

  return (
    <>
      <h3 className="text-i-darkblue font-semibold mb-4 text-lg text-center">
        소셜 로그인
      </h3>
      <p className="text-gray-500 text-sm text-center mb-4">
        간편하게 로그인하고 서비스를 이용하세요.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
