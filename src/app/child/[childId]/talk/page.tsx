// app/child/[childId]/talk/page.tsx
'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function TalkPage() {
  const { childId } = useParams();

  return (
    <section className="flex flex-col items-center gap-6 py-10">
      <h2 className="text-2xl font-bold">대화 시작</h2>
      <p className="opacity-70">원하는 모드를 선택하세요.</p>

      <div className="mt-4 flex flex-col gap-4">
        <Link
          href={`/child/${childId}/talk/question`}
          className="w-72 h-20 rounded-2xl bg-pink-300 flex items-center justify-center text-xl font-bold hover:scale-105 transition-transform"
        >
          오늘의 질문
        </Link>
        <Link
          href={`/child/${childId}/talk/free`}
          className="w-72 h-20 rounded-2xl bg-green-300 flex items-center justify-center text-xl font-bold hover:scale-105 transition-transform"
        >
          하고싶은 말
        </Link>
      </div>
    </section>
  );
}
