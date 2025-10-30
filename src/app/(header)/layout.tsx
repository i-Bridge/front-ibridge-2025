import React from 'react';
import Header from '@/components/Header/Header'; 

/**
 * (app) 라우트 그룹 레이아웃
 * 이 레이아웃은 로그인 프로세스(start)를 통과한 후, 
 * 개인정보 동의, 가족 설정, 가족 합류 상태 확인 등 
 * 모든 메인 서비스 층(/privacy-consent, /family-setup, /join-status, /profile 등)에 적용됩니다.
 * * - 헤더를 고정 배치합니다.
 * - 컨텐츠 영역에 헤더 높이만큼 패딩을 주어 겹치지 않도록 합니다.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 💡 참고: 전체 배경은 설정하지 않으며, 페이지 배경은 각 페이지(children)에서 설정 가능
    <div className="min-h-screen">
      
      {/* 1. 고정 헤더 */}
      {/* Header에 필요한 props(showAdmin, onAdminClick)는 상태 관리나 인증 컨텍스트를 통해 
        동적으로 주입할 수 있습니다. 여기서는 기본값으로 렌더링합니다.
      */}
      <Header />

      {/* 2. 메인 컨텐츠 영역 */}
      {/* pt-16: 고정된 Header(h-16) 높이만큼 상단 패딩을 주어 컨텐츠가 헤더 밑에 가려지는 것을 방지합니다. */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}
