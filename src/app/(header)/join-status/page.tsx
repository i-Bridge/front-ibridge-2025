import { redirect } from 'next/navigation';
import { Fetcher } from '@/lib/fetcher';
import { LoginData } from '@/types/index';
import FamilyJoinWaitingForm from '@/app/(header)/join-status/_components/FamilyJoinWaitingForm';
import FamilyJoinSuccessForm from '@/app/(header)/join-status/_components/FamilyJoinSuccessForm';
import ModalCard from '@/ui/Modal/ModalCard';

/**
 * 가족 합류 상태 층 (/join-status) - Async Server Component
 * 1. 서버에서 /start/login API를 호출합니다.
 * 2. status 3일 경우 즉시 리디렉션합니다.
 * 3. status 1 또는 2일 경우 이 페이지에서 직접 렌더링합니다.
 */
export default async function JoinStatusPage() {
  let data: LoginData | null = null;
  let hasError = false;

  try {
    const res = await Fetcher<LoginData>('/start/login');
    data = res?.data || null;
    console.log("login", data);

    if (!data) {
      throw new Error('/start/login에서 유효한 데이터를 받지 못했습니다.');
    }

    // [핵심] status 3은 서버에서 즉시 처리
    if (data.status === 2) {
      console.log('🚀 [SC] status 3 확인: /profile로 즉시 리디렉션');
      redirect('/profile');
    }

  } catch (e) {
    console.error('❌ [SC] 가족 상태 확인 실패:', e);
    hasError = true;
  }

  // --- LoginStatusRenderer 로직 시작 ---

  // 에러가 발생했거나, status 3이 아닌데 data가 없는 비정상적 상황
  if (hasError || !data || (data.status !== 0 && data.status !== 1)) {
    return (
      <ModalCard
        hasBorder={false}
        className="h-[400px] items-center justify-center"
      >
        가족 정보를 불러오는 데 실패했습니다.
        <br />
        다시 시도해 주세요.
      </ModalCard>
    );
  }

  const { status, familyName, parents } = data;
  const parentNames = parents.map((p) => p.name);

  if (status === 0) {
    // status: 0 (대기)
    return (
      <FamilyJoinWaitingForm
        familyName={familyName || '가족'}
        parentNames={parentNames}
      />
    );
  }

  if (status === 1) {
    // status: 1 (수락 성공)
    return (
      <FamilyJoinSuccessForm
        familyName={familyName || '가족'}
        parentNames={parentNames}
      />
    );
  }

  // --- LoginStatusRenderer 로직 종료 ---

  // (이 코드는 실행되지 않지만, TypeScript를 위한 안전 장치)
  return (
    <ModalCard
      hasBorder={false}
      className="h-[400px] items-center justify-center"
    >
      알 수 없는 상태입니다.
    </ModalCard>
  );
}
