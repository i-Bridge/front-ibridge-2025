'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ParentHeader() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -5, transition: { duration: 0.2 } },
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-i-ivory bg-opacity-95 z-50 shadow-md transition-all duration-300">
      <nav className="max-w-7xl mx-auto px-8 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/parent/home">
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={100}
              height={100}
              className="mr-10 transition-transform duration-300 hover:scale-105"
            />
          </Link>
          <div className="flex items-center gap-10">
            <Link
              href="/about"
              className="text-lg text-gray-800 font-medium hover:text-blue-600 transition-colors duration-300"
            >
              서비스 소개
            </Link>
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-lg text-gray-800 font-medium hover:text-blue-600 transition-colors duration-300 focus:outline-none"
              >
                질문하기
              </button>
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={menuVariants}
                    className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-xl w-48 overflow-hidden"
                  >
                    <Link
                      href="/parent/regular"
                      className="block px-4 py-3 hover:bg-gray-100 transition-colors duration-200"
                    >
                      정기질문
                    </Link>
                    <Link
                      href="/parent/board"
                      className="block px-4 py-3 hover:bg-gray-100 transition-colors duration-200"
                    >
                      게시판
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <Link
            href="/faq"
            className="text-lg text-gray-800 font-medium hover:text-blue-600 transition-colors duration-300"
          >
            자주 묻는 질문
          </Link>
          <Link href="/parent/calendar" className="relative group">
            <Image
              src="/images/calendar.png"
              alt="Calendar"
              width={30}
              height={30}
              className="rounded-lg transition-transform duration-300 group-hover:scale-110"
            />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              3
            </span>
          </Link>

          <div ref={profileMenuRef} className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="focus:outline-none group"
            >
              <Image
                src="/images/profile.png"
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full border-2 border-gray-300 transition-all duration-300 group-hover:border-blue-500 group-hover:shadow-md"
              />
            </button>

            {/* 프로필 드롭다운 메뉴 */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {/* 상단 사용자 정보 */}
                <div className="p-4 bg-gray-100 rounded-t-lg text-center">
                  <Image
                    src="/images/profile.png"
                    alt="User Profile"
                    width={60}
                    height={60}
                    className="rounded-full mx-auto mb-2 border border-gray-300 shadow-sm"
                  />
                  <p className="font-medium text-gray-800">사용자 이름</p>
                  <p className="text-sm text-gray-600">user@example.com</p>
                </div>

                {/* 주요 메뉴 */}
                <ul className="py-2">
                  <li>
                    <button
                      onClick={() => alert('회원 정보 수정')}
                      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                    >
                      회원 정보 수정
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => alert('자식 정보 수정 및 추가')}
                      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                    >
                      자식 정보 수정 및 추가
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => alert('자식 변경')}
                      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                    >
                      자식 변경
                    </button>
                  </li>
                </ul>

                {/* 기타 메뉴 */}
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

                {/* 로그아웃 버튼 */}
                <div className="border-t border-gray-300">
                  <button
                    onClick={() => alert('로그아웃')}
                    className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-100 rounded-b-lg"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
