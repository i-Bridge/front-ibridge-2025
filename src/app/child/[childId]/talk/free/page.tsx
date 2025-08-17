// 자유 발화 페이지
// app/child/[childId]/talk/free/page.tsx
'use client';

import { useEffect } from 'react';

export default function FreeTalkPage() {
  useEffect(() => {
    // 실제론 startFreeTalk() 등 호출 위치
    console.log(
      '자유 발화 모드 시작: 여긴 레이아웃(사이드바/HUD)이 숨겨져야 합니다.',
    );
  }, []);

  return (
    <section className="min-h-[60vh] grid place-items-center">
      <div className="rounded-2xl bg-white/10 p-8">
        <h3 className="text-xl font-semibold">자유 발화 모드</h3>
        <p className="mt-2 opacity-80">
          여기에 ReplyPage(녹화/AI응답) 화면을 렌더하세요.
        </p>
      </div>
    </section>
  );
}
