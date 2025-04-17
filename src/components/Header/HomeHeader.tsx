import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Fetcher } from '@/lib/fetcher';
import DropMotionMypage from './DropMotionMypage';
import MailBox from './MailBox';

type PageProps = {
  childId: string;
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
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email || '';
  const userName = session?.user?.name || '';
  let mypageData: MyPageData | undefined = undefined;

  try {
    const res = await Fetcher<MyPageData>('/start/login');
    mypageData = res.data;
  } catch (err) {
    console.error('API 호출 중 오류 발생:', err);
    return <div>데이터를 불러오지 못했습니다.</div>;
  }

  if (!mypageData) {
    return <div>로딩 중...</div>;
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-i-ivory bg-opacity-95 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-8 py-1 flex justify-between items-center">
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
        <MailBox/>
      </nav>
    </header>
  );
}
