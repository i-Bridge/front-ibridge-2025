import Link from 'next/link';
import { ApiResponse } from '@/types';
import { Child } from '@/types';
import { fetchLoginData } from '@/app/services/profile/fetchLoginData';

export default async function Profile() {
  const res: ApiResponse<
  {
    isSuccess: boolean;
    isAccepted: boolean;
    familyName: string;
    children: Child[];
  }, 
  { isSuccess: boolean }
> = await fetchLoginData();

  if (!res.data.isSuccess) {
    return <p> 데이터 로드 실패 </p>;
  }

  const ProfileData = res.data;
  return (
    <div className="w-full h-screen flex flex-col bg-gray-100">
      {/* 상단: 관리 계정 프로필 */}
      <div className="flex justify-center items-center flex-wrap gap-8 p-8 bg-white border-b">
      <p><strong>가족명:</strong> {ProfileData.familyName}</p>

        {ProfileData.children.map((child) => (
          <div key={child.id} className="flex flex-col items-center">
            <Link href={`/parent/${child.id}/home`}>
              <div className="w-32 h-32 bg-blue-500 rounded-full hover:ring-4 hover:ring-blue-300 cursor-pointer flex items-center justify-center text-white">
                {child.name}의 부모페이지 
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* 하단: 자식 계정 프로필 */}
      <div className="flex justify-center items-center flex-wrap gap-8 p-8">
      {ProfileData.children.map((child) => (
          <div key={child.id} className="flex flex-col items-center">
            <Link href={`/parent/${child.id}/home`}>
              <div className="w-32 h-32 bg-blue-500 rounded-full hover:ring-4 hover:ring-blue-300 cursor-pointer flex items-center justify-center text-white">
                {child.name}의 자식페이지
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
