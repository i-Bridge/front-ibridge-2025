// src/app/child/home


import Link from 'next/link';
import Progress from './progress';

export default function ChildHome() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* 캐릭터 위치 */}
      <Link href="/child/reply">
        <div className="w-24 h-24 bg-gray-400 rounded-full flex items-center justify-center mb-6 cursor-pointer" style={{ marginTop: '-5%' }}>
          캐릭터
        </div>
      </Link>
      {/* 진행 상황 표시 */}
      <Progress />
    </div>
  );

}
