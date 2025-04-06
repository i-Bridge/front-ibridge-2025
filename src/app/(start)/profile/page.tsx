import Link from 'next/link';
import { fetchLoginData } from '@/app/services/profile/fetchLoginData';

export default async function Profile() {
  const profileData = await fetchLoginData();

  if (!profileData) {
    return <div>데이터를 불러오지 못했습니다.</div>; //return을 해줘야 null이 아닌 걸로 타입스크립트가 안심 가능
  }
  if (!profileData.isAccepted) {
    return <div> isAccepted: false </div>; 
    }

    if (!profileData.isSend) {
      console.log('isSend 거짓:',profileData.isSend);
      return <div> isSend: false </div>; 
      }


  return (
    <div className="w-full h-screen flex flex-col bg-gray-100">
      {/* 상단: 관리 계정 프로필 */}
      <div className="flex justify-center items-center flex-wrap gap-8 p-8 bg-white border-b">
      <p><strong>가족명:</strong> {profileData.familyName}</p>

        {profileData.children.map((child) => (
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
      {profileData.children.map((child) => (
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
