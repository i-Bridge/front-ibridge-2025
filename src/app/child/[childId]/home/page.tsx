'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function Child() {
  const params = useParams(); // 현재 URL에서 params 받아오기
  const childId = params.id as string; // childId 가져오기

  console.log('Params 값 시작화면:', params); // params 확인

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-center mt-8">
        걸어가는 사람 애니메이션
      </h1>

      <div className="w-40 bg-red-300 text-black mt-10 cursor-pointer">
        {/* Link로 동적 URL 이동 */}
        <Link href={`/child/home`}>child 홈 화면으로 이동</Link>
      </div>
    </div>
  );
}
