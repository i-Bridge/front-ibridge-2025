import { Fetcher } from '@/lib/fetcher';
import { LoginData } from '@/types';
import Header from '@/components/Header/Header';
import ModalCard from '@/ui/Modal/ModalCard';
import { Text } from '@/ui/Text';
import { ChildCard } from '@/components/ChildCard';
export const dynamic = 'force-dynamic';

export default async function Profile() {
  const res = await Fetcher<LoginData>('/start/login');
  const profileData = res.data;

  if (!profileData) {
    return <div>로딩 중...</div>;
  }
  if (!profileData.send) {
    return <div> 가족이 등록되지 않았습니다.</div>;
  }
  if (profileData.send && !profileData.accepted) {
    return <div> 가족 요청이 수락되지 않았습니다. </div>;
  }

  return (
    <>
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
        <div className="flex flex-col gap-5 self-stretch ">
          {profileData.children.map((child) => (
            <ChildCard
              key={child.id} // 💡 필수: 배열을 렌더링할 때는 고유한 key를 사용해야 합니다.
              child={child} // 💡 단수(child) 인자를 ChildCard에 전달합니다.
              showActions ={false}
            />
          ))}
        </div>
      </ModalCard>
    </>
  );
}
