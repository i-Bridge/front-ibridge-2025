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
    <div className="min-h-screen flex bg-[#0F1320] text-white">
      {/* 사이드바 */}
      {!hide && (
        <aside className="w-64 bg-[#1C1F2A] border-r border-white/10 p-4">
          <h2 className="text-lg font-bold">Sidebar</h2>
          <nav className="mt-4 space-y-2">
            <Link
              href={`/child/${childId}/reward`}
              className="block hover:underline"
            >
              Reward
            </Link>
            <Link
              href={`/child/${childId}/store`}
              className="block hover:underline"
            >
              Store
            </Link>
            <Link
              href={`/child/${childId}/talk`}
              className="block hover:underline"
            >
              Talk
            </Link>
          </nav>
        </aside>
      )}

      {/* 메인 */}
      <div className="flex-1">
        {!hide && (
          <header className="bg-[#1C1F2A] border-b border-white/10 p-3">
            <span className="font-semibold">Top HUD 영역</span>
          </header>
        )}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
