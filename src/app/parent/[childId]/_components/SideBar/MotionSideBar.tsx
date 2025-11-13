'use client';

import { useState } from 'react';
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

export default function MotionSidebar({
  childId,
  mypageData,
  currentChildName,
}: {
  childId: string;
  mypageData: MyPageData ;
  currentChildName: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

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
          onClick={() => setMenuOpen((v) => !v)}
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
          >
            <SidebarNav childId={childId} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
