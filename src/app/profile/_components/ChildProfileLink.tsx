'use client';

import Link from 'next/link';
import { ChildCard } from '@/components/ChildCard';
import { Child } from '@/types';
import { useState } from 'react';
import CarouselStepper from '@/components/CarouselStepper';
import { twMerge } from 'tailwind-merge';

interface ChildProfileLinkProps {
  childList: Child[];
}

export default function ChildProfileLink({ childList }: ChildProfileLinkProps) {
  // --- 캐러셀 상태 관리 (데스크탑용) ---
  const [currentPage, setCurrentPage] = useState(1);
  const totalChildren = childList.length;
  const itemsPerPage = 2;
  const totalPages = Math.ceil(totalChildren / itemsPerPage);

  if (totalChildren === 0) {
    return null;
  }

  // --- 데스크탑용: 현재 페이지에 보여줄 자녀 계산 ---
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const childrenOnPage = childList.slice(startIndex, endIndex);

  return (
    <div className="w-full flex flex-col items-center justify-start gap-5">
      
      {/* -------------------------------------------------------------------------
        [Mobile View] md 미만 (< 768px)
        - overflow-x-auto: 이 영역 내부에서만 스크롤 발생
        - w-full: 부모 너비에 딱 맞춤 (화면 전체 확장 방지)
        - -mx-5: 부모의 px-5 패딩을 상쇄하여 화면 끝까지 영역 확장
        - px-5: 내부 콘텐츠의 시작점은 다시 20px 안쪽으로 정렬
        -------------------------------------------------------------------------
      */}
      <div className="md:hidden w-full relative">
        <div 
          className="flex items-center gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-5 px-5"
          // 아래 스타일은 모바일에서 스크롤바를 숨기기 위한 CSS 유틸리티입니다.
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
        >
          {childList.map((child) => (
            <Link
              key={child.id}
              href={`/child/${child.id}/home`}
              // flex-shrink-0: 공간이 좁아도 카드가 찌그러지지 않음
              className="snap-center flex-shrink-0 min-w-[14rem] transition-transform duration-150 active:scale-95"
            >
              <ChildCard
                child={child}
                showActions={false}
                cardClassName="w-full"
              />
            </Link>
          ))}
          
          {/* 오른쪽 끝 여백 확보용 (선택사항) */}
          <div className="w-0.5 flex-shrink-0" />
        </div>
      </div>

      {/* -------------------------------------------------------------------------
        [Desktop View] md 이상 (>= 768px)
        -------------------------------------------------------------------------
      */}
      <div className="hidden md:inline-flex w-full justify-center items-start gap-5">
        {childrenOnPage.map((child) => (
          <Link
            key={child.id}
            href={`/child/${child.id}/home`}
            className={twMerge(
              'block transition-transform duration-150 group hover:scale-[1.01]',
              (totalChildren === 2 || totalChildren >= 3) && 'flex-1',
            )}
          >
            <ChildCard
              child={child}
              showActions={false}
              cardClassName={twMerge(
                'group-hover:scale-[1.01]',
                totalChildren === 1 ? 'w-56' : 'w-full',
              )}
            />
          </Link>
        ))}
      </div>

      {/* 스텝퍼 (데스크탑 모드) */}
      <div className="hidden md:block">
        {totalPages > 1 && (
          <CarouselStepper
            currentStep={currentPage}
            totalSteps={totalPages}
            onStepChange={setCurrentPage}
            variant='profile'
          />
        )}
      </div>
    </div>
  );
}