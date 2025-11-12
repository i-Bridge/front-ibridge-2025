// ❌ 'use client' 빼야 함

import Sidebar from "./_components/SideBar/SideBar";
import { Fetcher } from "@/lib/api/fetcher";
import MotionSidebar from "./_components/SideBar/MotionSideBar";

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

export default async function ParentLayout({ children, params }: ParentLayoutProps) {
  const { childId } = params;

  let myPageData: MyPageData = {
    noticeExist: false,
    name: "",
    familyName: "",
    children: [],
  };

  try {
    const res = await Fetcher<MyPageData>("/parent/mypage");

    if (res?.data) {
      myPageData = res.data;
    } else {
      console.warn("API 응답 데이터가 비어 있음");
    }
  } catch (err) {
    console.error("API 호출 실패:", err);
  }

  const currentChild = myPageData?.children?.find(
    (child) => String(child.childId) === childId
  );
  const currentChildName = currentChild?.childName || "아이 선택";

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* --- 모바일 헤더 --- */}
      <MotionSidebar
        childId={childId}
        mypageData={myPageData }
        currentChildName={currentChildName}
      />

      {/* --- 데스크탑 사이드바 --- */}
      <div className="hidden lg:flex">
          <Sidebar
            childId={childId}
            mypageData={myPageData}
            currentChildName={currentChildName}
          />
      </div>

      {/* --- 본문 --- */}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}

