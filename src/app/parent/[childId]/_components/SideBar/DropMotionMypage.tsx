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

  const [profileClicked, setProfileClicked] = useState(false);

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
        setProfileClicked(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 페이지 이동 시 닫기
  useEffect(() => {
    setProfileOpen(false);
    setProfileClicked(false);
  }, [pathname]);

  return (
    // 이 컴포넌트의 부모(layout.tsx의 <div>)에
    // bg-Grayscale-gray5와 border-b-Grayscale-gray20가 적용되어야 합니다.
    <div className="bg-transparent">
      {pathname !== '/' && (
        <div
          ref={profileRef}
          className="relative" // 부모 컨테이너가 'relative'여야 합니다.
          onMouseEnter={() => {
            if (!profileClicked) setProfileOpen(true);
          }}
          onMouseLeave={() => {
            if (!profileClicked) setProfileOpen(false);
          }}
        >
          <button
            className="flex justify-start items-center w-full px-7 py-5 focus:outline-none gap-2"
            onClick={(e) => {
              e.stopPropagation();
              setProfileClicked((prev) => {
                const newClicked = !prev;
                setProfileOpen(newClicked);
                return newClicked;
              });
            }}
          >
            {/* [수정] 텍스트에 피그마 스타일 적용 */}
            <Text variant={'caption02'} className="text-grayscale-gray90 ">
              {currentChildName}
            </Text>

            {/* [수정] 아이콘을 w-6 h-6 컨테이너로 감싸 정렬 (피그마 참조) */}
            <div className=" flex items-center justify-center">
              <DownSideBarIcon />
            </div>
          </button>
          {/* ▲▲▲ [수정된 트리거 버튼] ▲▲▲ */}

          {/* 드롭다운 메뉴 */}
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={menuVariants}
                // [수정] 'absolute'를 적용해 다른 요소 위에 뜨게 합니다.
                // 부모의 패딩(px-7)에 맞춰 좌우 위치를 조정합니다.
                className="absolute top-full  mt-0 z-50"
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
