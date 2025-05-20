//회원 정보 설정 페이지 기본 UI

import React from 'react';
import Setup from '../../../components/Setup/setup';
import ProgressBar from '../../../components/Setup/progressBar';

export default function SetUpPage() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
  <div
    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200  relative overflow-visible origin-center"
    style={{
      width: '400px',
      transform: 'scale(calc(min(100vw / 500, 100vh / 600)))',
      transformOrigin: 'center',
    }}
  >
    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-i-lightpurple to-i-pink"></div>
    <ProgressBar />
    <div className="flex-1 flex flex-col justify-center items-center space-y-3 mt-4">
      <Setup />
    </div>
  </div>
</div>

  );
}
