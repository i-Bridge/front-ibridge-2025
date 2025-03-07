'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ParentHeader() {
  const params = useParams();
  const childId = params.childId as string;

  console.log('Params 값 헤더', childId);

  const [dropdowns, setDropdowns] = useState<Record<string, boolean>>({
    menu: false,
    profile: false,
    notifications: false,
  });

  const refs = {
    menu: useRef<HTMLDivElement | null>(null),
    profile: useRef<HTMLDivElement | null>(null),
    notifications: useRef<HTMLDivElement | null>(null),
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      Object.keys(refs).forEach((key) => {
        const refKey = key as keyof typeof refs;
        if (
          refs[refKey].current &&
          !refs[refKey].current!.contains(event.target as Node)
        ) {
          setDropdowns((prev) => ({ ...prev, [refKey]: false }));
        }
      });
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (key: string) => {
    setDropdowns((prev) => ({
      menu: false,
      profile: false,
      notifications: false,
      [key]: !prev[key],
    }));
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  const notifications = [
    { id: 1, message: '가족 초대가 도착했습니다!', time: '5분 전' },
    { id: 2, message: '새로운 메시지가 있습니다.', time: '30분 전' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-i-ivory bg-opacity-95 z-50 shadow-md">
      <nav className="max-w-7xl mx-auto px-8 py-3 flex justify-between items-center">
        {/* 로고 및 네비게이션 */}
        <div className="flex items-center gap-10">
          <Link href={`/parent/${childId}/home`}>
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={100}
              height={100}
              className="transition-transform duration-300 hover:scale-105"
            />
          </Link>
          <Link
            href="/about"
            className="text-lg font-medium hover:text-blue-600"
          >
            서비스 소개
          </Link>
          <div ref={refs.menu} className="relative">
            <button
              onClick={() => toggleDropdown('menu')}
              className="text-lg font-medium hover:text-blue-600 focus:outline-none"
              aria-expanded={dropdowns.menu}
            >
              질문하기
            </button>
            <AnimatePresence>
              {dropdowns.menu && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={menuVariants}
                  className="absolute top-full left-0 bg-white border rounded-lg shadow-xl w-48"
                >
                  <Link
                    href={`/parent/${childId}/regular`}
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    정기질문
                  </Link>
                  <Link
                    href={`/parent/${childId}/board`}
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    게시판
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 오른쪽 메뉴 */}
        <div className="flex items-center gap-5">
          <Link href="/faq" className="text-lg font-medium hover:text-blue-600">
            자주 묻는 질문
          </Link>

          {/* 알림 */}
          <div ref={refs.notifications} className="relative">
            <button
              onClick={() => toggleDropdown('notifications')}
              className="relative focus:outline-none"
            >
              <Image
                src="/images/mail.png"
                alt="mail"
                width={30}
                height={30}
                className="hover:scale-105"
              />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
            <AnimatePresence>
              {dropdowns.notifications && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={menuVariants}
                  className="absolute right-0 mt-2 w-64 bg-white border rounded-md shadow-xl"
                >
                  {notifications.length ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className="px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        {n.message}{' '}
                        <div className="text-xs text-gray-500">{n.time}</div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm">
                      새로운 알림이 없습니다.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 달력 */}
          <Link  href={`/parent/${childId}/calendar`} className="relative group">
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

          {/* 프로필 */}
          <div ref={refs.profile} className="relative">
            <button
              onClick={() => toggleDropdown('profile')}
              className="focus:outline-none"
            >
              <Image
                src="/images/profile.png"
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full border-2"
              />
            </button>
            <AnimatePresence>
              {dropdowns.profile && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={menuVariants}
                  className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg"
                >
                  <div className="p-4 bg-gray-100 text-center">
                    <Image
                      src="/images/profile.png"
                      alt="User Profile"
                      width={60}
                      height={60}
                      className="rounded-full mx-auto mb-2"
                    />
                    <p className="font-medium">사용자 이름</p>
                    <p className="text-sm text-gray-600">user@example.com</p>
                  </div>
                  <ul className="py-2">
                    <Link href={`/parent/mypage/${childId}/childedit`}>
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
                  <div className="border-t">
                    <button className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-100">
                      로그아웃
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </header>
  );
}
