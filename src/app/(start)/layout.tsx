import React from "react";
import Image from 'next/image';
import bgImage from '@/images/parent-bg.webp';

/**
 * (start) 라우트 그룹 레이아웃
 * 로그인 과정, 초기 상태 확인, 리디렉션 전까지의 화면을 담당
 */
export default function StartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-10">
      {/* 우선 로드되는 배경 이미지 */}
      <Image
        src={bgImage}
        alt="배경 이미지"
        fill
        priority
        className="object-cover object-center"
      />

      {/* children 영역 */}
      <div className="relative z-10 w-full flex justify-center items-center">
        {children}
      </div>
    </div>
  );
}
