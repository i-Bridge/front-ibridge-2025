'use client';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Mypage from './Mypage';


interface MyPageData {
  name: string;
  familyName: string;
  children: {
    id: number;
    name: string;
  }[];
}

type ClientComponentProps = {
  childId: string;
  mypageData: MyPageData;
  userName: string;  
  userEmail: string; 
};

export default function DropMotionMypage({ childId, mypageData,userName, userEmail }: ClientComponentProps) {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const [profileClicked, setProfileClicked] = useState(false);

  const menuVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };
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


  return (
    <div>
      {pathname !== '/' && (
        <div
          ref={profileRef}
          className="relative"
          onMouseEnter={() => {
            if (!profileClicked) setProfileOpen(true); // 클릭 안했으면 호버로 열림
          }}
          onMouseLeave={() => {
            if (!profileClicked) setProfileOpen(false); // 클릭 안했으면 호버로 닫힘
          }}
        >
          <button
            className="focus:outline-none"
            onClick={(e) => {
              e.stopPropagation(); // 이벤트 버그 방지
              setProfileClicked((prev) => {
                const newClicked = !prev;
                if (newClicked) {
                  setProfileOpen(true); // 클릭하면 무조건 열기
                } else {
                  setProfileOpen(false); // 다시 클릭하면 무조건 닫기
                }
                return newClicked;
              });
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 rounded-full p-1 mt-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={menuVariants}
                className="absolute right-0 mt-2 w-80 p-2 bg-white border rounded-lg shadow-lg"
              >
                <Mypage childId={childId} mypageData={mypageData} userName={userName} userEmail={userEmail} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
