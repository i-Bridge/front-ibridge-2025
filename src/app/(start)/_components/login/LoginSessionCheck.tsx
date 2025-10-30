'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { showError } from '@/lib/toast';
import { useEffect } from 'react';
import PostLoginProcessManager from './PostLoginProcessManager';
import PreLoginForm from './PreLoginForm';

export default function LoginSessionCheck() {
  const { data: session } = useSession();
  const router = useRouter();

  // 세션 만료 에러 처리
  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      showError('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
      router.push('/');
    }
  }, [session?.error, router]);

  // 세션이 있으면 로그인 후 상태 관리 컴포넌트 렌더링
  if (session) {
    return <PostLoginProcessManager session={session} />;
  }

  // 세션이 없으면 로그인 버튼이 있는 초기 화면 렌더링
  return <PreLoginForm />;
}