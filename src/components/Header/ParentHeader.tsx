'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHeaderContext } from '@/context/HeaderContext';
import { handleLogout } from '@/components/Auth/LogoutButton';
import ProfileMenu from '@/components/Header/ProfileMenu';

export default function ParentHeader() {
  const params = useParams();
  const childId = params.childId as string;
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const { hideHeader } = useHeaderContext();

const [profileClicked, setProfileClicked] = useState(false);

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
    {profileOpen && <ProfileMenu childId={childId} />}
  </AnimatePresence>
</div>

      </nav>
    </header>
  );
}
