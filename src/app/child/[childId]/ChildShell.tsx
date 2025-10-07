// app/child/[childId]/ChildShell.tsx
'use client';

import type { ReactNode } from 'react';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import FullscreenToggle from './_components/FullscreenToggle';

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
    <div className="min-h-screen flex bg-[#FDFDFD] text-gray-800 relative">
      {/* ✅ [추가] 전체 화면 토글 버튼을 화면 우측 상단에 배치합니다. */}
      {/* 이 버튼은 hide 상태와 상관없이 항상 보입니다. */}
      <div className="absolute bottom-6 right-6 z-50">
        <FullscreenToggle />
      </div>
      {/* 사이드바 */}
      {!hide && (
        <aside className="w-64 bg-[#FFF9E6] border-r border-gray-200 p-4 flex flex-col justify-between">
          <div>
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
          </div>
          {/* ✅ [추가] 사이드바 하단에 프로필 페이지로 가는 버튼을 추가합니다. */}
          <div>
            <Link
              href="/profile"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-200 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
              <span>프로필</span>
            </Link>
          </div>
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
        <main className={!hide ? 'p-6' : ''}>{children}</main>
      </div>
    </div>
  );
}
