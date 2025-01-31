'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function ParentHeader() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="p-2.5 px-5 flex items-center justify-between border-b-2 border-gray-300">
      <div className="flex items-center">
        <Link href="/parent/home">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={50}
            height={50}
            className="rounded-full mr-10"
          />
        </Link>
        <div className="flex items-center gap-5">
          <span className="text-lg text-gray-800 font-medium">서비스 소개</span>
          <div
            className="relative"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <span className="text-lg text-gray-800 font-medium cursor-pointer">
              질문하기
            </span>
            {showDropdown && (
              <div className="absolute top-full left-0 bg-white border border-gray-300 rounded shadow-md">
                <Link
                  href="/parent/regular-question"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  정기질문
                </Link>
                <Link
                  href="/parent/question/board"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  게시판
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5">
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
            width={40}
            height={40}
            className="rounded-lg"
          />
        </Link>
        <button className="bg-none border-none p-0 cursor-pointer flex items-center hover:opacity-70">
          <Image
            src="/images/profile.png"
            alt="Profile"
            width={50}
            height={50}
            className="rounded-full"
          />
        </button>
      </div>
    </header>
  );
}
