import Link from 'next/link';
import { Fetcher } from '@/lib/fetcher';
import { Child } from '@/types';
import ParentDropdown from './_components/ParentDropDown';  

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

  {
    /* error page needed */
  }

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
      {/* 가족 이름 */}
      <div className="bg-white p-8"></div>
      <div className="w-full  p-8 bg-white text-4xl font-semibold text-center ">
        <p>
          <strong>🏠 </strong> {profileData.familyName}
          <strong> 🏠</strong>
          
        </p>
      </div>

      {/* 우측 상단 부모 드롭다운 */}
      <div className="absolute top-6 right-6">
        <ParentDropdown childrenData={profileData.children} />
      </div>

      {/* 자식 계정 프로필 */}
      <div className="flex justify-center items-center flex-wrap gap-8 p-8  bg-orange-100 ">
        {profileData.children.map((child) => (
          <div key={child.id} className="flex flex-col items-center">
            <Link href={`/child/${child.id}/talk`}>
              <div className="text-2xl w-32 h-32 bg-i-lightorange rounded-full hover:shadow-md hover:bg-i-lightorange/70 cursor-pointer flex items-center justify-center text-white  text-center break-words">
                {child.name}
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="w-full h-[200px] bg-orange-100"></div>
    </div>
  );
}
