'use client';
// (이 컴포넌트는 클라이언트 컴포넌트인 error.tsx와 not-found.tsx 양쪽에서
//  사용되므로 'use client'로 만드는 것이 관리하기 편합니다.)

import type { ReactNode } from 'react';
import { ErrorPageIcon } from '@/ui/icon/icon';
import { Text } from '@/ui/Text';

interface ErrorDisplayProps {
  /**
   * 메인 제목 텍스트 (예: "404 Not Found", "오류가 발생했어요")
   */
  title: string;
  /**
   * 제목 아래에 표시될 부제목 텍스트
   */
  message: string;
  /**
   * 하단에 표시될 버튼 (ReactNode로 받아 1개 또는 2개를 유연하게 처리)
   */
  actions: ReactNode;
}

/**
 * 에러 페이지(404, 500 등)의 공통 UI 레이아웃을 제공합니다.
 */
export default function ErrorDisplay({
  title,
  message,
  actions,
}: ErrorDisplayProps) {
  return (
    // Figma 디자인을 기반으로 한 레이아웃
    <div className="w-full min-h-screen bg-white inline-flex flex-col justify-center items-center gap-10 p-4 ">
      <div className="self-stretch flex flex-col justify-center items-center gap-7">
        
        {/* 1. 동적 아이콘 */}
        <ErrorPageIcon/>

        {/* 2. 동적 텍스트 */}
        <div className="flex flex-col justify-start items-center gap-2">
          <Text variant='title01'className="justify-center text-primary-primary">
            {title}
          </Text>
          <Text variant='body04' className="justify-center text-grayscale-gray60 ">
            {message}
          </Text>
        </div>
      </div>

      {/* 3. 동적 버튼 영역 */}
      <div className="flex items-center gap-4">
        {actions}
      </div>
    </div>
  );
}
