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
    return <div>  accepted false </div>;
  }

  if (!profileData.send) {
    return <div>  send false </div>;
  }

  return (
    <div className="w-full h-screen flex flex-col ">
      {/* 가족 이름 */}
      <div className="w-full mt-8 p-8 text-4xl font-semibold text-center ">
        <p>
          <strong>🏠 </strong> {profileData.familyName}
          <strong> 🏠</strong>

        </p>
      </div>

      {/* 부모 계정 프로필 */}
      <div className="flex justify-center items-center flex-wrap gap-8 p-8">
        {profileData.children.map((child) => (
          <div key={child.id} className="flex flex-col items-center ">
            <Link href={`/parent/${child.id}/home`}>
              <div className="text-center break-words text-xl w-28 h-28  bg-i-lightgreen rounded-full  hover:shadow-md hover:bg-i-lightgreen/70 cursor-pointer flex items-center justify-center text-white">
                {child.name}
              </div>
              
            </Link>
            <span className="text-center text-sm text-gray-400 mt-2">
                부모님
              </span>
          </div>
        ))}
      </div>



      {/* 자식 계정 프로필 */}
      <div className="flex justify-center items-center flex-wrap gap-8 p-8  bg-orange-100 ">
        {profileData.children.map((child) => (
          <div key={child.id} className="flex flex-col items-center">
            <Link href={`/child/${child.id}/home`}>
              <div className="text-2xl w-28 h-28 bg-i-lightorange rounded-full hover:shadow-md hover:bg-i-lightorange/70 cursor-pointer flex items-center justify-center text-white  text-center break-words">
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
