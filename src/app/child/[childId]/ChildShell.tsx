// app/child/[childId]/ChildShell.tsx
'use client';

import type { ReactNode } from 'react';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';

function shouldHideLayout(pathname: string, childId?: string | string[]) {
  if (!pathname || !childId) return false;
  const base = `/child/${childId}/talk`;
  // /talk/question, /talk/free 에서는 사이드바/헤더 감춤
  return pathname === `${base}/question` || pathname === `${base}/free`;
}

export default function ChildShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { childId } = useParams();
  const hide = shouldHideLayout(pathname ?? '', childId);

  return (
    <div className="min-h-screen flex bg-[#FDFDFD] text-gray-800">
      {/* 사이드바 */}
      {!hide && (
        <aside className="w-64 bg-[#FFF9E6] border-r border-gray-200 p-4">
          <h2 className="text-lg font-bold text-[#FF8A3D]">메뉴</h2>
          <nav className="mt-4 space-y-2">
            <Link
              href={`/child/${childId}/reward`}
              className="block px-3 py-2 rounded-lg bg-[#FFEDD5] hover:bg-[#FFD8A8] transition"
            >
              🎁 Reward
            </Link>
            <Link
              href={`/child/${childId}/store`}
              className="block px-3 py-2 rounded-lg bg-[#E0F7FA] hover:bg-[#B2EBF2] transition"
            >
              🛒 Store
            </Link>
            <Link
              href={`/child/${childId}/talk`}
              className="block px-3 py-2 rounded-lg bg-[#E8F5E9] hover:bg-[#C8E6C9] transition"
            >
              💬 Talk
            </Link>
          </nav>
        </aside>
      )}

      {/* 메인 */}
      <div className="flex-1">
        {!hide && (
          <header className="bg-[#FFF9E6] border-b border-gray-200 p-3">
            <span className="font-semibold text-[#FF8A3D]">
              ✨ 오늘도 즐겁게 대화해요!
            </span>
          </header>
        )}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
