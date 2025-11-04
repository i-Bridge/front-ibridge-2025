'use client';

import Link from 'next/link';
import { ChildCard } from '@/components/ChildCard';
import { Child } from '@/types';
// [추가] 3명 이상일 때 캐러셀 상태 관리를 위해 import
import { useState } from 'react';
// [추가] 3명 이상일 때 사용할 스텝퍼 import (경로 확인 필요)
import CarouselStepper from '@/components/CarouselStepper';
import { twMerge } from 'tailwind-merge';

interface ChildProfileLinkProps {
  childList: Child[];
}

/**
 * [수정]
 * 자녀 수에 따라 프로필 선택 UI를 분기합니다.
 * - 1명: 중앙 (w-56)
 * - 2명: 꽉찬 2열 (flex-1)
 * - 3명 이상: 2명씩 페이징되는 캐러셀
 */
export default function ChildProfileLink({ childList }: ChildProfileLinkProps) {
  // --- 캐러셀 상태 관리 ---
  const [currentPage, setCurrentPage] = useState(1);
  const totalChildren = childList.length;
  const itemsPerPage = 2; // [수정] 한 페이지에 2명씩
  const totalPages = Math.ceil(totalChildren / itemsPerPage);

  // --- 0명일 때 ---
  if (totalChildren === 0) {
    return null;
  }

  // --- 1. 현재 페이지에 보여줄 자녀 계산 ---
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const childrenOnPage = childList.slice(startIndex, endIndex);

  // --- 2. 렌더링 ---
  return (
    <div className="w-full flex flex-col items-center justify-start gap-5">
      {/* 2-1. 카드 영역 */}
      {/* 이 컨테이너는 1명이든 2명이든 화면에 맞게 중앙 정렬/배치합니다. */}
      <div className="w-full inline-flex justify-center items-start gap-5">
        {childrenOnPage.map((child) => (
          <Link
            key={child.id}
            href={`/child/${child.id}/home`}
            // [수정] 레이아웃 로직
            // 1명일 땐(totalChildren=1) Link가 너비 X
            // 2명일 땐(totalChildren=2) Link가 'flex-1'
            // 3명 이상(캐러셀)일 땐, Link가 'flex-1' (페이지가 2명 꽉차게)
            className={twMerge(
              'block transition-transform duration-150 group hover:scale-[1.01]',
              // 2명일 때, 또는 3명 이상 캐러셀 모드일 때
              (totalChildren === 2 || totalChildren >= 3) && 'flex-1',
            )}
          >
            <ChildCard
              child={child}
              showActions={false}
              cardClassName={twMerge(
                'group-hover:scale-[1.01]', // 모든 경우에 적용되는 기본 클래스
                totalChildren === 1 ? 'w-56' : 'w-full', // 조건부 클래스
              )}
            />
          </Link>
        ))}
      </div>

      {/* 2-2. 스텝퍼 (3명 이상일 때만 보임) */}
      {totalPages > 1 && (
        <CarouselStepper
          currentStep={currentPage}
          totalSteps={totalPages}
          onStepChange={setCurrentPage}
        />
      )}
    </div>
  );
}
