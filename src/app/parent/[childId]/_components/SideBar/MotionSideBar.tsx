'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MenuIcon, XIcon } from '@/ui/icon/icon';
import SidebarNav from './SideBarNav';
import DropMotionMypage from './DropMotionMypage';

interface MyPageData {
  noticeExist: boolean;
  name: string;
  familyName: string;
  children: {
    childId: string;
    childName: string;
  }[];
}

interface MotionSidebarProps {
  childId: string;
  mypageData: MyPageData;
  currentChildName: string;
}

export default function MotionSidebar({
  childId,
  mypageData,
  currentChildName,
}: MotionSidebarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  // 메뉴가 닫히기 전 지연 시간을 관리할 ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 메뉴 열기 (또는 닫힘 예약 취소)
  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setMenuOpen(true);
  };

  // 메뉴 닫기 (즉시 닫지 않고 약간의 딜레이를 줌)
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setMenuOpen(false);
    }, 300); // 0.3초 딜레이: 버튼에서 메뉴로 이동할 시간 확보
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* 모바일 헤더 */}
      <header className="lg:hidden self-stretch px-7 inline-flex justify-between items-center border-b border-grayscale-gray20 bg-white z-50 relative">
        <div className="flex justify-start items-center">
          <DropMotionMypage
            childId={childId}
            mypageData={mypageData}
            currentChildName={currentChildName}
          />
        </div>

        <button
          className="w-6 h-6 relative flex justify-center items-center"
          // 모바일 터치 환경을 위해 클릭 이벤트 유지
          onClick={() => setMenuOpen((v) => !v)}
          // 호버 이벤트 추가
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          {menuOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </header>

      {/* 슬라이드 메뉴 */}
      <AnimatePresence>
        {menuOpen && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-16 right-0 h-[calc(100%-64px)] w-64 bg-grayscale-gray5 border-l border-grayscale-gray20 z-40 shadow-lg p-5 flex flex-col"
            // 메뉴 영역에 호버 시 닫힘 방지 및 벗어날 때 닫기 처리
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <SidebarNav childId={childId} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}