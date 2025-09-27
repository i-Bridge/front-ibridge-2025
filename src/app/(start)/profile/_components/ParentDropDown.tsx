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
      {/* 아이콘 버튼 */}
      <button className="p-2 rounded-full  hover:bg-gray-100">
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
            d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
          />
        </svg>
      </button>


      {/* 드롭다운 */}
      {open && (
        <div className="absolute right-0  w-56 bg-white shadow-lg rounded-lg  overflow-hidden z-50">
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
