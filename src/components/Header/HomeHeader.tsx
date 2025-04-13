import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; 
import { Fetcher } from '@/lib/fetcher';
import DropMotionMypage from './DropMotionMypage';

type PageProps = {
  childId: number;
};

interface MyPageData {
  name: string;
  familyName: string;
  children: {
    id: number;
    name: string;
  }[];
}

export default async function HomeHeader({ childId }: PageProps) {
  let userEmail = '';
  let userName = '';
  const session = await getServerSession(authOptions);
    console.log('Server session:', session); // 로깅
    userEmail = session?.user?.email || '';
    userName = session?.user?.name || '';
  let mypageData: MyPageData | null = null; // try-catch 바깥에서 선언

  try {
    const res = await Fetcher<{ isSuccess: boolean; data: MyPageData }>(
      '/start/login',
    );

    if (!res) {
      return <div>로딩 중...</div>; // 서버에서 데이터를 못 가져온 경우
    }

    // 정상적으로 데이터를 가져온 경우
    mypageData = res.data;
  } catch (err) {
    console.error('API 호출 중 오류 발생:', err);
    return <div>데이터를 불러오지 못했습니다.</div>; // 오류 발생 시 표시
  }

  // profileData가 없다면 로딩 중 또는 데이터 오류를 표시
  if (!mypageData) {
    return <div>로딩 중...</div>;
  }

  return (
    <header className="fixed top-0 left-0 right-0  bg-i-ivory bg-opacity-95 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-8 py-1 flex justify-between items-center">
        {/* 로고 */}
        <Link href={`/parent/${childId}/home`}>
          <img
            src="/images/logo.svg"
            alt="Logo"
            className="w-24 h-auto transition-transform duration-300 hover:scale-105"
          />
        </Link>
        <DropMotionMypage
          childId={childId}
          mypageData={mypageData}
          userName={userName}
          userEmail={userEmail}
        />
      </nav>
    </header>
  );
}
