// app/AppLayout.tsx
import React from 'react';
import Header from '@/components/Headers/Header';
import { twMerge } from 'tailwind-merge';

/**
 * (app) 라우트 그룹 레이아웃
 * 이 레이아웃은 로그인 프로세스(start)를 통과한 후,
 * 개인정보 동의, 가족 설정, 가족 합류 상태 확인 등
 * 모든 메인 서비스 층(/privacy-consent, /family-setup, /join-status, /profile 등)에 적용됩니다.
 * * - 헤더를 고정 배치합니다.
 * - 컨텐츠 영역에 헤더 높이만큼 패딩을 주어 겹치지 않도록 합니다.
 * * 🛠️ 수정: children이 짧을 때 화면 중앙에 배치되도록 main에 flexbox 적용
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    // 💡 min-h-screen: 전체 화면 높이 확보
    // 💡 flex flex-col: 자식 요소(Header, main)를 수직으로 배치
    <div className="min-h-screen flex flex-col">
      {/* 1. 고정 헤더 (상단에 고정) */}
      <Header />

      {/* 2. 메인 컨텐츠 영역 */}
      {/* 💡 flex-1: 남은 수직 공간을 모두 차지 (Header 높이 제외) */}
      {/* 💡 pt-16: 헤더 높이(h-16)만큼 상단 패딩을 주어 컨텐츠가 헤더 밑에 가려지는 것을 방지합니다. */}
      {/* 💡 flex justify-center items-center: (자식 컨텐츠가 짧을 때) 수직/수평 중앙 정렬 적용 */}
      {/* 💡 overflow-auto: 내용이 길어지면 main 영역 내에서 스크롤 허용 */}
      <main
        className={twMerge(
          'flex-1 pt-16 overflow-auto', // 레이아웃 및 패딩 기본 설정
          'flex flex-col justify-center items-center', // 중앙 정렬 설정
        )}
      >
        {/* 컨텐츠가 짧을 때만 중앙 정렬 효과를 내고, 길 때도 정상적으로 작동하도록 
             children을 감싸는 div를 추가하여 최대 너비를 제한하고 중앙 정렬합니다.
             이 wrapper가 실제 중앙 정렬의 대상이 됩니다. */}

        {children}
      </main>
    </div>
  );
}
