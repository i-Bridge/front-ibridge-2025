//회원 정보 설정 페이지 기본 UI

import React from 'react';
import Setup from '../../../components/Setup/setup';
import ProgressBar from '../../../components/Setup/progressBar';

export default function SetUpPage() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
  <div
    className="bg-white p-6 rounded-lg shadow-sm origin-center"
    style={{
      width: '400px',
      transform: 'scale(calc(min(100vw / 500, 100vh / 600)))',
      transformOrigin: 'center',
    }}
  >
    <ProgressBar />
    <div className="flex-1 flex flex-col justify-center items-center">
      <Setup />
    </div>
  </div>
</div>

  );
}
