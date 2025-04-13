import Link from 'next/link';
import { Fetcher } from '@/lib/fetcher';
import { Child } from '@/types';

export interface ProfileData {
  accepted: boolean;
  send: boolean;
  familyName: string;
  children: Child[];
}

export default async function Profile() {
  let profileData: ProfileData | null = null; // try-catch 바깥에서 선언

  try {const res = await Fetcher<ProfileData>('/start/login');
      if (!res) {
      return <div>로딩 중...</div>; // 서버에서 데이터를 못 가져온 경우
    }
    console.log('받아온 profile res:', res);

    // 정상적으로 데이터를 가져온 경우
    profileData = res.data;
  } catch (err) {
    console.error('API 호출 중 오류 발생:', err);
    return <div>데이터를 불러오지 못했습니다.</div>; // 오류 발생 시 표시
  }

  // profileData가 없다면 로딩 중 또는 데이터 오류를 표시
  if (!profileData) {
    return <div>로딩 중...</div>;
  }
  // ProfileData의 accepted와 send 값에 따른 처리
  if (!profileData.accepted) {

    return <div>isAccepted: false</div>;
  }

  if (!profileData.send) {
    console.log('send 거짓:', profileData.send);
    return <div>send: false</div>;
  }

  console.log('받아온 profileData:', profileData);


  return (
    <div className="w-full h-screen flex flex-col bg-gray-100">
      {/* 상단: 관리 계정 프로필 */}
      <div className="flex justify-center items-center flex-wrap gap-8 p-8 bg-white border-b">
        <p>
          <strong>가족명:</strong> {profileData.familyName}
        </p>

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


