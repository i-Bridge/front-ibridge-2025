'use client';

import DropMotionMypage from './DropMotionMypage';
import SidebarNav from './SideBarNav';

interface MyPageData {
  noticeExist: boolean;
  name: string;
  familyName: string;
  children: {
    childId: string;
    childName: string;
  }[];
}

export default function Sidebar({
  childId,
  mypageData,
  currentChildName,
}: {
  childId: string;
  mypageData?: MyPageData | null;
  currentChildName: string;
}) {
  if (!mypageData) return <Sidebar.Skeleton />;

  return (
    <aside className="w-60 h-screen bg-white lg:bg-grayscale-gray5 border-r border-grayscale-gray20 flex flex-col">
      <DropMotionMypage
        childId={childId}
        mypageData={mypageData}
        currentChildName={currentChildName}
      />
      <nav className="flex-1 overflow-y-auto mt-5 lg:mt-0">
        <SidebarNav childId={childId} />
      </nav>
    </aside>
  );
}

// 로딩 시 스켈레톤
Sidebar.Skeleton = function SidebarSkeleton() {
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
};
