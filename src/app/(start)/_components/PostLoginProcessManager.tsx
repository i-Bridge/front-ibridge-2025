'use client';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Fetcher } from '@/lib/fetcher';
import { showSuccess, showError } from '@/lib/toast';
import { Session } from 'next-auth';
import { SigninResponse } from '@/types';

import AccountCheckingForm from '@/app/(start)/_components/AccountCheckingForm';

// 로그인 후 상태 정의 (내부 분류용)
type LoginStatus =
  | 'idle' // 초기 상태
  | 'checking' // /start/signin 호출 중
  | 'needsConsent' // 리디렉션 -> /privacy-consent
  | 'needsFamily' // 리디렉션 -> /family-setup
  | 'hasFamilyUser'; // 리디렉션 -> /join-status

// /start/signin 응답 타입


export default function PostLoginProcessManager({
  session,
}: {
  session: Session;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<LoginStatus>('idle');
  
  // 💡 [수정] 
  // API 호출 시도를 추적하는 ref를 추가합니다.
  // ref는 컴포넌트가 unmount 되어도 값을 유지합니다.
  const hasAttemptedApiCall = useRef(false);

  const sendUserDataToBackend = useCallback(async () => {
    if (!session?.user) return;

    setStatus('checking');
    try {
      const encodedName = session.user.name
        ? Buffer.from(session.user.name, 'utf-8').toString('base64')
        : '';

      const signinRes = await Fetcher<SigninResponse>('/start/signin', {
        method: 'POST',
        data: {
          email: session.user.email,
          name: encodedName,
        },
      });

      

      const data = signinRes?.data;

      console.log('signin: ', data);
      if (!data) throw new Error('서버에서 응답 데이터를 받지 못했습니다.');

      // 1. API 응답에서 모든 속성을 구조 분해합니다.
      const { first, requiredPIIConsent, send, hasFamily } = data;

      // 2. 'first'가 true일 경우, 회원가입 환영 토스트를 띄웁니다.
      //    상태 결정 로직과는 분리합니다.
      if (first) {
        showSuccess('회원가입되었습니다.만나서 반가워요 😊');
      }

      // 3. 3가지 규칙에 따라 상태(status)를 설정합니다.
      //    가장 우선순위가 높은 'hasFamilyUser' 상태부터 확인합니다.

      // 규칙 3: family가 참이거나, (family가 거짓이면서 send가 참이면) -> hasFamilyUser
      if (hasFamily || (!hasFamily && send)) {
        setStatus('hasFamilyUser');
      }
      // 규칙 2: family가 거짓이고 requiredPIIConsent가 참이면 -> needsFamily
      else if (!hasFamily && requiredPIIConsent) {
        setStatus('needsFamily');
      }
      // 규칙 1: family가 거짓이고 requiredPIIConsent가 거짓이면 -> needsConsent
      else if (!hasFamily && !requiredPIIConsent) {
        setStatus('needsConsent');
      }
      // (참고) 위의 3가지 규칙으로 모든 !hasFamily 케이스가 커버됩니다.
      // (hasFamily: F, send: T) -> hasFamilyUser
      // (hasFamily: F, send: F, requiredPIIConsent: T) -> needsFamily
      // (hasFamily: F, send: F, requiredPIIConsent: F) -> needsConsent


    } catch (error) {
      console.error('❌ 사용자 정보 확인 실패:', error);
      showError('사용자 정보를 확인하는 중 오류가 발생했습니다.');
      // setStatus('idle'); // 필요 시 주석 해제
    }
  }, [session]); // 💡 router 의존성 제거

  // 세션 만료 처리
  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      showError('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
      router.replace('/');
    }
  }, [session?.error, router]);

  //  API 호출 트리거
  useEffect(() => {
    // 💡 [수정] 
    // 기존 조건과 더불어, "아직 API 호출을 시도한 적이 없는지" 확인합니다.
    if (!session?.user || !session?.accessToken || status !== 'idle' || hasAttemptedApiCall.current) {
      return;
    }

    // 💡 [수정]
    // API 호출을 시도하기 직전에 "시도했음" 플래그를 true로 설정합니다.
    hasAttemptedApiCall.current = true;
    sendUserDataToBackend();
  }, [session, status, sendUserDataToBackend]);

  // 리디렉션 useEffect
  useEffect(() => {
    // 'idle', 'checking' 상태일 때는 이 (start) 레이아웃에 머무름
    const shouldStay = ['idle', 'checking'].includes(status);
    if (shouldStay) return;

    // 🚀 나머지 상태는 (app) 레이아웃의 다른 페이지로 이동
    let path: string | null = null;

    if (status === 'needsConsent') {
      path = '/privacy-consent'; // 1번 층
    } else if (status === 'needsFamily') {
      path = '/family-setup'; // 2번 층
    } else if (status === 'hasFamilyUser') {
      path = '/join-status'; // 3번 층
    }

    // 유효한 '층'으로만 리디렉션 수행
    if (path) {
      console.log(`🧭 [Status: ${status}] -> ${path}로 리디렉션`);
      router.replace(path); // 💡 Next.js의 replace 사용 (뒤로가기 X)
    }
  }, [status, router]); // 💡 status 변경 시 이 효과 실행

  console.log('Current Status:', status);

  // 9. 💡 렌더링 로직 '대폭' 수정
  // 이 컴포넌트는 (start) 레이아웃에 머무는 동안 'checking' 뷰만 렌더링함
  const renderStatusView = () => {
    const userName = session?.user?.name || '사용자';

    switch (status) {
      case 'checking':
      case 'needsConsent': // 리디렉션 되기 전까지 로딩 뷰를 보여줌
      case 'needsFamily': // "
      case 'hasFamilyUser': // "
        return <AccountCheckingForm userName={userName} />;
      case 'idle':
      default:
        return null;
    }
  };

  return <div>{renderStatusView()}</div>;
}
