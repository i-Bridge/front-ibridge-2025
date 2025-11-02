import { redirect } from 'next/navigation';
import { Fetcher } from '@/lib/fetcher';
import { LoginResponse } from '@/types/index';
import FamilyJoinWaitingForm from '@/app/(header)/join-status/_components/FamilyJoinWaitingForm';
import FamilyJoinSuccessForm from '@/app/(header)/join-status/_components/FamilyJoinSuccessForm';
import * as Sentry from "@sentry/nextjs";

//서버 컴포넌트에서 클라이언트 함수(toast)를 호출할 수 없습니다.


/**
 * 가족 합류 상태 층 (/join-status) - Async Server Component
 * 1. 서버에서 /start/login API를 호출합니다.
 * 2. status 3일 경우 즉시 리디렉션합니다.
 * 3. status 1 또는 2일 경우 이 페이지에서 직접 렌더링합니다.
 */
export default async function JoinStatusPage() {
  let loginData: LoginResponse | null = null;

  // --- 1. 데이터 페칭 ---
  try {
    const res = await Fetcher<LoginResponse>('/start/login');
    loginData = res?.data || null;
    console.log("login", loginData);

  } catch (err) {
    Sentry.captureException(err); 
    console.error('❌ [SC] 가족 상태 확인 실패:', err);

    throw new Error(`[JoinStatusPage] API Fetch Error: ${(err as Error).message}`);
  }

  // --- 2. 데이터 유효성 검사 ---
  // loginData가 null이면(API 응답이 비었거나 실패), 
  // TypeError를 내는 대신 error.tsx를 트리거합니다.
  if (!loginData) {
    const err = new Error('[JoinStatusPage] No loginData received from API.');
    Sentry.captureException(err);
    throw err;
  }

  // --- 3. 정상 로직 수행 ---
  // 이 시점에는 loginData가 null이 아님이 보장됩니다.
  const { status, familyName, parents } = loginData;

  // 3-1. status: 'ACTIVE' ( 프로필 )
  if (status === 'ACTIVE') {
    console.log('🚀 [SC] status 3 확인: /profile로 즉시 리디렉션');
    redirect('/profile'); 
  }

  // 3-2. status: 'PENDING' (대기)
  if (status === 'PENDING') {
    return (
      <FamilyJoinWaitingForm
        familyName={familyName || '가족'}
        parents={parents}
      />
    );
  }

  // 3-3. status: 'FIRST_LOGIN' (수락 성공)
  if (status === 'FIRST_LOGIN') {
    return (
      <FamilyJoinSuccessForm
        familyName={familyName || '가족'}
        parents={parents}
      />
    );
  }

  // 3-4. 예외 케이스 (e.g. PENDING, FIRST_LOGIN, ACTIVE가 아닌 다른 상태값)
  const err = new Error(`[JoinStatusPage] Unknown status received: ${status}`);
  Sentry.captureException(err);
  throw err; 
}
