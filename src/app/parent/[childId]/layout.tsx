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

// 로딩 UI 컴포넌트 (피그마 디자인에 맞게 w-60으로 수정)
function SidebarSkeleton() {
  return (
    <aside className="w-60 fixed top-0 left-0 h-full bg-Grayscale-gray5 border-r border-Grayscale-gray20 flex flex-col animate-pulse">
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
  const session = await getServerSession(authOptions);

  if (!session) {
    // 세션이 없으면 로그인 페이지로 리다이렉트 (또는 에러 UI)
    // return redirect('/login'); // 혹은 아래처럼 에러 UI 표시
    return (
      <aside className="w-60 fixed top-0 left-0 h-full bg-grayscale-gray5 border-r border-grayscale-gray20 flex flex-col">
        <div className="p-4">로그인이 필요합니다.</div>
      </aside>
    );
  }

  let mypageData: MyPageData | undefined = undefined;

  try {
    const res = await Fetcher<MyPageData>('/parent/mypage');
    mypageData = res.data;
  } catch (err) {
    console.error('API 호출 중 오류 발생:', err);
    return (
      <aside className="w-60 fixed top-0 left-0 h-full bg-grayscale-gray5 border-r border-grayscale-gray20 flex flex-col">
        <div className="p-4">데이터 로드 실패</div>
      </aside>
    );
  }

  if (!mypageData) {
    return <SidebarSkeleton />;
  }

  // 현재 childId를 기반으로 아이 이름 찾기 (타입 통일)
  const currentChild = mypageData.children.find(
    (child) => String(child.childId) === childId,
  );
  const currentChildName = currentChild?.childName || '아이 선택';

  return (
    // [수정] 피그마 디자인의 루트 컨테이너 스타일 적용
    <aside className="w-60 fixed top-0 left-0 h-full bg-grayscale-gray5 border-r border-grayscale-gray20 flex flex-col">
      {/* 1. 아이 이름 + 드롭다운 트리거 (피그마 디자인 적용을 위해 DropMotionMypage로 모두 위임) */}
      {/* 이 컴포넌트가 '이서연' + 아이콘 버튼 및 드롭다운 메뉴를 모두 렌더링합니다. */}
      <DropMotionMypage
        childId={childId}
        mypageData={mypageData}
        currentChildName={currentChildName}
      />

      {/* 2. 네비게이션 메뉴 (피그마 디자인 적용을 위해 SidebarNav로 모두 위임) */}
      <nav className="flex-1 overflow-y-auto">
        <SidebarNav childId={childId} />
      </nav>
    </aside>
  );
}

export default function ParentLayout({ children, params }: ParentLayoutProps) {
  const childId = params.childId;

  return (
    <div className=''>
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar childId={childId} />
      </Suspense>

      <main className="ml-60 flex justify-center">
        {children}
      </main>
    </div>
  );
}
