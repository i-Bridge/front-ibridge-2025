'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Child } from '@/types';

export default function ParentDropdown({ childrenData }: { childrenData: Child[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* 관리자 아이콘 (집 모양) */}
      <button className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-gray-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
          />
        </svg>
      </button>

      {/* 드롭다운 */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg border overflow-hidden z-50">
          <div className="p-2 text-gray-700 font-semibold border-b">부모님 계정</div>
          <ul className="max-h-60 overflow-auto">
            {childrenData.map((child) => (
              <li key={child.id}>
                <Link
                  href={`/parent/${child.id}/home`}
                  className="block px-4 py-2 text-gray-700 hover:bg-orange-50"
                >
                  👨‍👩‍👧 {child.name} 부모님
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
