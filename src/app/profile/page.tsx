import { Fetcher } from '@/lib/api/fetcher';
import { LoginResponse } from '@/types';
import ParentHeader from '@/components/Headers/ParentHeader';
import ModalCard from '@/ui/Modal/ModalCard';
import ChildProfileLink from '@/app/profile/_components/ChildProfileLink';
import * as Sentry from '@sentry/nextjs';
import TitleComponent from '@/ui/Modal/TitleComponent';

export const dynamic = 'force-dynamic';

export default async function Profile() {
  let profileData: LoginResponse | null = null;

  try {
    const res = await Fetcher<LoginResponse>('/start/login');

    if (!res.data) {
      const err = new Error('프로필 정보가 없습니다. (API data is null)');
      Sentry.captureException(err);
      throw err;
    }

    profileData = res.data;
  } catch (error) {
    console.error('❌ [SC] Profile page fetch error:', error);
    if (!(error as Error).message.includes('프로필')) {
      Sentry.captureException(error);
    }
    throw new Error(
      `[ProfilePage] API Fetch Error: ${(error as Error).message}`,
    );
  }

  // 3-1-1. 자녀 정보가 없는 경우 (ACTIVE이지만 자녀 0명)

  return (
    <>
      {/* Header, ModalCard, Text 등은 서버 컴포넌트에서 렌더링 가능합니다 */}
      <ParentHeader firstchildId={profileData.children[0].id} />
      <ModalCard hasBorder={false}>
        <div className="flex flex-col gap-3">
          <TitleComponent title={'안녕, 환영해! \n너의 프로필을 선택해줘!'} subtitle={`${profileData.familyName}`} subtitlePosition='top' align="start" />
        </div>
        <ChildProfileLink childList={profileData.children} />
      </ModalCard>
    </>
  );
}
