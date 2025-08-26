import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Fetcher } from '@/lib/fetcher';
import DropMotionMypage from './DropMotionMypage';
import MailBox from './MailBox';

type HeaderProps = {
  childId: string;
};

interface MyPageData {
  noticeExist: boolean;
  name: string;
  familyName: string;
  children: {
    childId: string;
    childName: string;
  }[];
}

export default async function HomeHeader({ childId }: HeaderProps) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email || '';
  const userName = session?.user?.name || '';
  let mypageData: MyPageData | undefined = undefined;

  try {
    const res = await Fetcher<MyPageData>('/parent/mypage');
    mypageData = res.data;
  } catch (err) {
    console.error('API 호출 중 오류 발생:', err);
    return <div>데이터를 불러오지 못했습니다.</div>;
  }

  if (!mypageData) {
    return <div>로딩 중...</div>;
  }

  return (
    <header className="fixed top-0 left-0 right-0  bg-opacity-95 z-50  bg-white h-14">
      <nav className="max-w-7xl mx-auto px-8 py-1 flex justify-between items-center ">
        <Link href={`/parent/${childId}/home`}>
          <div className="w-24 h-auto transition-transform duration-300 hover:scale-105">
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={96} // w-24 = 6rem = 96px
              height={0} // 비율 유지하려면 0 + className="h-auto"
              className="h-auto"
              priority // 로고는 초기에 로딩
            />
          </div>
        </Link>
        <div className="flex flex-row space-x-3">
          <div className="relative">
            <Link href={`/parent/${childId}/statistics`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-10 h-10  p-1 mt-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
                />
              </svg>
            </Link>
          </div>
          <div className="relative">
            <MailBox />
            {mypageData.noticeExist && (
              <div className="absolute top-2 right-0 w-2 h-2 z-10 bg-orange-400 rounded-full " />
            )}
          </div>

          <DropMotionMypage
            childId={childId}
            mypageData={mypageData}
            userName={userName}
            userEmail={userEmail}
          />
        </div>
      </nav>
    </header>
  );
}
