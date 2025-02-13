// src/app/child/video

import Link from 'next/link';

export default function ChildHome() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* 캐릭터 위치 */}
      <h2> Youtube Video </h2>
      <Link href="/child/home">
        <div className="  h-12 text-red-500  flex items-center justify-center mb-6 cursor-pointer" style={{ marginTop: '-5%' }}>
          영상 시청 완료 버튼
        </div>
      </Link>
      
    </div>
  );

}
