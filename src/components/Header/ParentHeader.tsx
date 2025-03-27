'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHeaderContext } from '@/context/HeaderContext';

export default function ParentHeader() {
  const params = useParams();
  const childId = params.childId as string;
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const { hideHeader } = useHeaderContext();

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

  const menuVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  if (hideHeader) return null; // hideHeader가 true이면 헤더를 렌더링하지 않음

  return (
    <header className="fixed top-0 left-0 right-0  bg-i-ivory bg-opacity-95 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-8 py-1 flex justify-between items-center">
        {/* 로고 */}
        <Link href={`/parent/${childId}/home`}>
          <img
            src="/images/logo.svg"
            alt="Logo"
            className="w-24 h-auto transition-transform duration-300 hover:scale-105"
          />
        </Link>

        {/* 프로필 */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="focus:outline-none"
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
                className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg"
              >
                <div className="p-4 bg-gray-100 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-16 h-16 mx-auto mb-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                  <p className="font-medium">사용자 이름</p>
                  <p className="text-sm text-gray-600">user@example.com</p>
                </div>

                {/* 메뉴 */}
                <ul className="py-2">
                  <Link href={`/parent/${childId}/familyedit`}>
                    <li>
                      <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                        가족 정보 수정
                      </button>
                    </li>
                  </Link>
                  <li>
                    <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                      자식 변경
                    </button>
                  </li>
                </ul>

                {/* 기타 */}
                <div className="border-t border-gray-300">
                  <ul>
                    <li>
                      <button
                        onClick={() => alert('새 프로필 추가')}
                        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                      >
                        새 프로필 추가
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => alert('프로필 관리')}
                        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-b-lg"
                      >
                        프로필 관리
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="border-t">
                  <button className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-100">
                    로그아웃
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </header>
  );
}
