// src/app/setup/page.tsx
//회원 정보 설정 페이지 기본 UI

// page.tsx (메인 UI)
import React from 'react';
import Setup from './setup';
import ProgressBar from './progressBar';

export default function SetUpPage() {
    return (
      <div className="w-full inset-y-0 flex justify-center items-center bg-gray-100">
        <div className="bg-gray-300 p-6 rounded-lg w-[25vw] h-[50vh] flex flex-col absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-black text-sm text-center mb-2">회원 정보 등록</h1>
          <ProgressBar />
          <div className="flex-1 flex flex-col justify-center items-center">
            <Setup />
          </div>
        </div>
      </div>
    );
  };
  
