import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Fetcher } from '@/lib/fetcher';
import DropMotionMypage from '@/app/parent/[childId]/_components/SideBar/DropMotionMypage';
import SidebarNav from '@/app/parent/[childId]/_components/SideBar/SideBarNav';
import { Suspense } from 'react';

// 원본 코드의 타입을 그대로 사용합니다.
interface MyPageData {
  noticeExist: boolean;
  name: string;
  familyName: string;
  children: {
    childId: string;
    childName: string;
  }[];
}

type ParentLayoutProps = {
  children: React.ReactNode;
  params: {
    childId: string;
  };
};

// 로딩 UI 컴포넌트
function SidebarSkeleton() {
  return (
    <aside className="w-60 h-screen flex-shrink-0 bg-Grayscale-gray5 border-r border-Grayscale-gray20 flex flex-col animate-pulse">
      <div className="px-7 py-5">
        <div className="h-7 bg-gray-300 rounded w-3/4"></div>
      </div>
      <nav className="flex-1 px-5 py-4 space-y-3">
        <div className="h-11 bg-gray-300 rounded-xl"></div>
        <div className="h-11 bg-gray-200 rounded-xl"></div>
        <div className="h-11 bg-gray-200 rounded-xl"></div>
      </nav>
    </aside>
  );
}

// 비동기 데이터를 불러오는 실제 사이드바
async function Sidebar({ childId }: { childId: string }) {
  // ... (Sidebar 로직은 이전과 동일) ...
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <aside className="w-60 h-screen flex-shrink-0 bg-grayscale-gray5 border-r border-grayscale-gray20 flex flex-col">
        <div className="p-4">로그인이 필요합니다.</div>
      </aside>
    );
  }

  let myPageData: MyPageData | undefined = undefined;

  try {
    const res = await Fetcher<MyPageData>('/parent/mypage');
    myPageData = res.data;
  } catch (err) {
    console.error('API 호출 중 오류 발생:', err);
    return (
      <aside className="w-60 h-screen flex-shrink-0 bg-grayscale-gray5 border-r border-grayscale-gray20 flex flex-col">
        <div className="p-4">데이터 로드 실패</div>
      </aside>
    );
  }

  if (!myPageData) {
    return <SidebarSkeleton />;
  }

  const currentChild = myPageData.children.find(
    (child) => String(child.childId) === childId,
  );
  const currentChildName = currentChild?.childName || '아이 선택';

  return (
    <aside className="w-60 h-screen flex-shrink-0 bg-grayscale-gray5 border-r border-grayscale-gray20 flex flex-col">
      <DropMotionMypage
        childId={childId}
        mypageData={myPageData}
        currentChildName={currentChildName}
      />
      <nav className="flex-1 overflow-y-auto">
        <SidebarNav childId={childId} />
      </nav>
    </aside>
  );
}


export default function ParentLayout({ children, params }: ParentLayoutProps) {
  const childId = params.childId;

  return (
    <div className='flex'>
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar childId={childId} />
      </Suspense>

      {/* [수정] 
        1. 'flex'를 추가하여 자식(PageLayout)의 정렬을 제어합니다.
        2. 'min-[1200px]:justify-center'
           - 뷰포트가 1200px (사이드바 240px + 최소 콘텐츠 960px) 보다 클 때는 'justify-center' (가운데 정렬)
           - 뷰포트가 1200px 보다 작을 때는 flex의 기본값인 'justify-start' (왼쪽 정렬)이 적용됩니다.
        3. 'overflow-auto'는 PageLayout의 min-w-[960px]에 대응하여 가로 스크롤을 허용합니다.
      */}
      <main className="flex-1 h-screen overflow-auto flex min-[1200px]:justify-center">
        {children}
      </main>
    </div>
  );
}

