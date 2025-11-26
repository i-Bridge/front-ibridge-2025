'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Text } from '@/ui/Text';

type StepperVariant = 'profile' | 'calendar';

interface CarouselStepperProps {
  /** 현재 단계 (1부터 시작) */
  currentStep: number;
  /** 전체 단계 수 */
  totalSteps: number;
  /** 단계 변경 시 호출되는 콜백 */
  onStepChange: (newStep: number) => void;
  /** 스타일 변형 선택 ('profile' | 'calendar') - 기본값: 'profile' */
  variant?: StepperVariant;
  /** 추가적인 Tailwind 클래스 */
  className?: string;
}

/**
 * 캐러셀이나 단계별 폼에서 사용되는 네비게이션 컴포넌트입니다.
 * variant prop에 따라 'profile' 또는 'calendar' 스타일을 렌더링합니다.
 */
export default function CarouselStepper({
  currentStep,
  totalSteps,
  onStepChange,
  variant = 'calendar',
  className,
}: CarouselStepperProps) {
  // 비활성화 상태 로직
  const isPrevDisabled = currentStep <= 1;
  const isNextDisabled = currentStep >= totalSteps;

  const handlePrev = () => {
    if (!isPrevDisabled) onStepChange(currentStep - 1);
  };

  const handleNext = () => {
    if (!isNextDisabled) onStepChange(currentStep + 1);
  };

  // --- 스타일 설정 ---

  // 1. 컨테이너 스타일
  const containerClass = twMerge(
    'inline-flex justify-start items-center',
    variant === 'profile' ? 'gap-5' : 'gap-3',
    className,
  );

  // 2. 버튼 공통 스타일 (크기, 배경, 둥글기)
  const buttonBaseClass = twMerge(
    'flex justify-center items-center transition-all',
    'rounded-full', // rounded-[999px] 등은 rounded-full로 대체 가능
    variant === 'profile'
      ? 'w-10 h-10 gap-2.5 bg-grayscale-gray5 '
      : 'w-6 h-6 gap-2 bg-grayscale-gray10 ', // p-1.5 등은 flex 정렬로 자동 처리
    // Hover 효과 (비활성화 아닐 때만)
    variant === 'profile' && !isPrevDisabled && !isNextDisabled
      ? 'hover:bg-grayscale-gray10'
      : '',
    variant === 'calendar' && !isPrevDisabled && !isNextDisabled
      ? 'hover:bg-grayscale-gray20'
      : '',
  );

  // 3. 아이콘 크기 (SVG)
  const iconSizeClass = variant === 'profile' ? 'w-6 h-6' : 'w-3 h-3'; // Calendar는 작게

  // 4. 텍스트 렌더링 (Variant별 구조 차이 반영)
  const renderText = () => {
    if (variant === 'profile') {
      return (
        <Text variant="body02" className="text-center select-none">
          {currentStep}/{totalSteps}
        </Text>
      );
    }
    // Calendar variant: 숫자와 슬래시가 분리된 구조
    return (
      <Text
        variant="caption03"
        className="text-grayscale-gray70 text-center select-none"
      >
        {currentStep}/{totalSteps}
      </Text>
    );
  };

  return (
    <div className={containerClass}>
      {/* 이전 버튼 */}
      <button
        type="button"
        onClick={handlePrev}
        disabled={isPrevDisabled}
        aria-label="이전 단계"
        className={twMerge(
          buttonBaseClass,
          isPrevDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
        )}
      >
        <ChevronLeftIcon className={iconSizeClass} />
      </button>

      {/* 텍스트 영역 */}
      {renderText()}

      {/* 다음 버튼 */}
      <button
        type="button"
        onClick={handleNext}
        disabled={isNextDisabled}
        aria-label="다음 단계"
        className={twMerge(
          buttonBaseClass,
          isNextDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
        )}
      >
        <ChevronRightIcon className={iconSizeClass} />
      </button>
    </div>
  );
}

// --- 아이콘 컴포넌트 (SVG) ---
// Figma의 div outline 아이콘 대신 깨끗한 SVG를 사용합니다.

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5} // font-extrabold 느낌을 위해 두께 조정
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 19.5 8.25 12l7.5-7.5"
      />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m8.25 4.5 7.5 7.5-7.5 7.5"
      />
    </svg>
  );
}
