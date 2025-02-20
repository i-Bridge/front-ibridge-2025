'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

export default function ParentHeader() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 감지
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

  return (
    <header className="fixed top-0 left-0 right-0 bg-opacity-90 z-50 shadow-md">
      <nav className="max-w-7xl mx-auto px-8 py-3 flex justify-between items-center">
        {/* 로고 */}
        <div className="flex items-center">
          <Link href="/parent/home">
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={100}
              height={100}
              className="mr-10"
            />
          </Link>
          <div className="flex items-center gap-10">
            <span className="text-lg text-gray-800 font-medium">
              서비스 소개
            </span>
            <div
              ref={dropdownRef}
              className="relative"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span className="text-lg text-gray-800 font-medium cursor-pointer">
                질문하기
              </span>
              {showDropdown && (
                <div className="absolute top-[110%] left-0 bg-white border border-gray-300 rounded shadow-md w-40 z-10">
                  <Link
                    href="/parent/regular"
                    className="block px-4 py-2 hover:bg-gray-100 w-full"
                  >
                    정기질문
                  </Link>
                  <hr className="border-t border-gray-300" />
                  <Link
                    href="/parent/board"
                    className="block px-4 py-2 hover:bg-gray-100 w-full"
                  >
                    게시판
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 우측 메뉴 */}
        <div className="flex items-center gap-10">
          <span className="text-lg text-gray-800 font-medium">
            자주 묻는 질문
          </span>
          <Link
            href="/parent/calendar"
            className="bg-none border-none p-0 cursor-pointer flex items-center hover:opacity-70"
          >
            <Image
              src="/images/calendar.png"
              alt="Calendar"
              width={35}
              height={35}
              className="rounded-lg"
            />
          </Link>

          {/* 프로필 버튼 */}
          <div ref={profileMenuRef} className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="bg-none border-none p-0 cursor-pointer flex items-center hover:opacity-70"
            >
              <Image
                src="/images/profile.png"
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full border border-gray-300 shadow-sm"
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
