'use client';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Mypage from './Mypage';
import { DownSideBarIcon } from '@/ui/icon/icon';
import { Text } from '@/ui/Text';

interface MyPageData {
  name: string;
  familyName: string;
  children: {
    childId: string;
    childName: string;
  }[];
}

type ClientComponentProps = {
  childId: string;
  mypageData: MyPageData;
  currentChildName: string;
};

export default function DropMotionMypage({
  childId,
  mypageData,
  currentChildName,
}: ClientComponentProps) {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const menuVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  // 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 페이지 이동 시 닫기
  useEffect(() => {
    setProfileOpen(false);
  }, [pathname]);

  return (
    <div className="bg-transparent">
      {pathname !== '/' && (
        <div
          ref={profileRef}
          className="relative"
        >
          <button
            className="flex justify-start items-center w-full px-7 py-5 focus:outline-none gap-2"
            onClick={(e) => {
              e.stopPropagation();
              setProfileOpen((prev) => !prev);
            }}
          >
            <Text variant={'caption02'} className="text-grayscale-gray90 ">
              {currentChildName}
            </Text>

            <div className="flex items-center justify-center">
              <DownSideBarIcon />
            </div>
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={menuVariants}
                className="absolute top-full mt-0 z-50"
              >
                <Mypage childId={childId} mypageData={mypageData} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
