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
        <p> 부모님 </p>
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
