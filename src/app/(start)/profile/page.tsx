import Link from 'next/link';
import { Fetcher } from '@/lib/fetcher';
import { Child } from '@/types';

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

  if (!profileData.accepted) {
    return <div> 403: accepted false </div>;
  }

  if (!profileData.send) {
    return <div> 403: send false </div>;
  }

  console.log('받아온 profileData:', profileData); // 추후 삭제 예정

  return (
    <div className="w-full h-screen flex flex-col">
      {/* 상단: 관리 계정 프로필 */}
      <div className="flex justify-center items-center flex-wrap gap-8 p-8  bg-white ">
        <p>
          <strong>가족명:</strong> {profileData.familyName}
        </p>

        {profileData.children.map((child) => (
          <div key={child.id} className="flex flex-col items-center ">
            <Link href={`/parent/${child.id}/home`}>
              <div className="w-32 h-32 bg-i-skyblue rounded-full hover:ring-4 hover:ring-blue-300 cursor-pointer flex items-center justify-center text-white">
                {child.name} 부모님
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* 하단: 자식 계정 프로필 */}
      <div className="flex justify-center items-center flex-wrap gap-8 p-8 ml-32">
        {profileData.children.map((child) => (
          <div key={child.id} className="flex flex-col items-center">
            <Link href={`/parent/${child.id}/home`}>
              <div className="w-32 h-32 bg-i-lightpurple rounded-full hover:ring-4 hover:ring-blue-300 cursor-pointer flex items-center justify-center text-white">
                {child.name}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
