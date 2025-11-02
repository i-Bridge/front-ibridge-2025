import { Fetcher } from '@/lib/fetcher';
import { LoginResponse } from '@/types';
import Header from '@/components/Headers/Header';
import ModalCard from '@/ui/Modal/ModalCard';
import { Text } from '@/ui/Text';
import ChildProfileLink from '@/app/profile/_components/ChildProfileLink';

export const dynamic = 'force-dynamic';

export default async function Profile() {
  const res = await Fetcher<LoginResponse>('/start/login');
  
  const profileData = res.data;
  console.log('login', profileData);
  // --- 데이터 상태에 따른 분기 (이전과 동일) ---
  if (!profileData) {
    return <div>로딩 중...</div>;
  }
  if (profileData.status !== 'ACTIVE') {
    return <div> 가족이 등록되지 않았습니다.</div>;
  }
  // --- ---

  return (
    <>
      {/* Header, ModalCard, Text 등은 서버 컴포넌트에서 렌더링 가능합니다 */}
      <Header firstchildId={profileData.children[0].id} />
      <ModalCard hasBorder={false}>
        <div className="flex flex-col gap-3">
          <Text variant={'title03'} className="text-grayscale-gray60">
            {profileData.familyName}
          </Text>

          <Text variant={'title01'} className="">
            안녕, 환영해!
            <br />
            너의 프로필을 선택해줘!
          </Text>
        </div>
        <div className="w-full flex flex-col gap-5 self-stretch ">
          {profileData.children.map((child) => (
            <ChildProfileLink key={child.id} child={child} />
          ))}
        </div>
      </ModalCard>
    </>
  );
}
