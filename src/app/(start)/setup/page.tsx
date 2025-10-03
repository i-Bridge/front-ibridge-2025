//회원 정보 설정 페이지 기본 UI

import React from 'react';
import Setup from './_components/Setup';
import ProgressBar from './_components/ProgressBar';

export default function SetUpPage() {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-orange-100">
  <div
    className="bg-white p-6 shadow-sm border border-gray-200  relative overflow-visible origin-center rounded-3xl scrollbar-custom"
     style={{
      width: '30vw',            // 화면 가로의 30%
      maxWidth: '500px',        // 최대 500px 넘지 않도록
      maxHeight: '90vh',        // 세로도 화면의 90%까지만
      overflowY: 'auto',        // 내용이 넘치면 스크롤
      transformOrigin: 'center',
    }}
  >
    <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-r from-orange-300 to-orange-400"></div>
    <ProgressBar />
    <div className="flex-1 flex flex-col justify-center items-center space-y-3 mt-4">
      <Setup />
    </div>
  </div>
</div>

  );
}
