import { Fetcher } from '@/lib/fetcher';
import { Child } from '@/types';
import ParentDropdown from './_components/ParentDropDown';
import ChildSelector from './_components/ChildSelector';

export const dynamic = 'force-dynamic';

interface ProfileData {
  accepted: boolean;
  send: boolean;
  familyName: string;
  children: Child[];
}

export default async function Profile() {
  const res = await Fetcher<ProfileData>('/start/login');
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
    <div className="w-full h-screen flex flex-col bg-orange-100">
      <div className="bg-white p-8"></div>
      <div className="w-full p-8 bg-white text-4xl font-semibold text-center ">
        <p>
          <strong>🏠 </strong> {profileData.familyName}
          <strong> 🏠</strong>
        </p>
      </div>
      <div className="absolute top-6 right-6">
        <ParentDropdown childrenData={profileData.children} />
      </div>

      <ChildSelector childrenData={profileData.children} />
      <div className="w-full h-[200px] bg-orange-100"></div>
    </div>
  );
}
