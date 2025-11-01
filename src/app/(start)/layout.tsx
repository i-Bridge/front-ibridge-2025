import React from "react";
/**
 * (start) 라우트 그룹 레이아웃
 * 이 레이아웃은 로그인 과정, 초기 상태 확인, 리디렉션이 일어나기 전까지의 화면을 담당합니다.
 * 주로 전체 화면 중앙에 컨텐츠(LoginSessionCheck -> PostLoginProcessManager)를 배치하는 역할을 합니다.
 */
export default function StartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 전체 화면을 꽉 채우고, 배경색을 설정합니다.
    // children (PostLoginProcessManager) 내부의 ModalCard가 이 배경 위에 중앙에 배치됩니다.
    <div className="bg-[url('/images/parent-bg.webp')] bg-cover bg-center min-h-screen  flex items-center justify-center px-10 ">
      {/* 자식 컴포넌트(LoginSessionCheck -> PostLoginProcessManager) 렌더링 영역
        PostLoginProcessManager는 여기서 상태를 확인하고, 층 분리 리디렉션이 일어나면 
        이 레이아웃에서 벗어나 /privacy-consent 등의 (app) 레이아웃으로 이동하게 됩니다. 
      */}
      {children}
    </div>
  );
}