'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge'; // 설치하신 tailwind-merge를 사용합니다.

interface CarouselStepperProps {
  /** 현재 단계 (1부터 시작) */
  currentStep: number;
  /** 전체 단계 수 */
  totalSteps: number;
  /** 단계 변경 시 호출되는 콜백 (예: (newStep) => setStep(newStep)) */
  onStepChange: (newStep: number) => void;
  /** 추가적인 Tailwind 클래스 */
  className?: string;
}

/**
 * 캐러셀이나 단계별 폼에서 사용되는 `< 1/2 >` 형태의 네비게이션 컴포넌트입니다.
 * 부모 상태를 제어하는 'Controlled Component'입니다.
 *
 * @example
 * // 부모 컴포넌트 (예: app/some-page.tsx)
 * 'use client';
 * import { useState } from 'react';
 * import CarouselStepper from './CarouselStepper';
 *
 * export default function MyPage() {
 * const [currentStep, setCurrentStep] = useState(1);
 * const TOTAL_STEPS = 3;
 *
 * return (
 * <div className="p-10 flex flex-col items-center gap-4">
 * <h2 className="text-lg font-bold">
 * 현재 페이지: {currentStep}
 * </h2>
 *
 * <CarouselStepper
 * currentStep={currentStep}
 * totalSteps={TOTAL_STEPS}
 * onStepChange={setCurrentStep}
 * />
 * </div>
 * );
 * }
 */
export default function CarouselStepper({
  currentStep,
  totalSteps,
  onStepChange,
  className,
}: CarouselStepperProps) {
  // 비활성화 상태 로직
  const isPrevDisabled = currentStep <= 1;
  const isNextDisabled = currentStep >= totalSteps;

  // 이전 버튼 핸들러
  const handlePrev = () => {
    if (!isPrevDisabled) {
      onStepChange(currentStep - 1);
    }
  };

  // 다음 버튼 핸들러
  const handleNext = () => {
    if (!isNextDisabled) {
      onStepChange(currentStep + 1);
    }
  };

  return (
    <div
      className={twMerge(
        'inline-flex justify-start items-center gap-5',
        className,
      )}
    >
      {/* 1. 이전 버튼 */}
      <button
        type="button"
        onClick={handlePrev}
        disabled={isPrevDisabled}
        aria-label="이전"
        className={twMerge(
          'w-10 h-10 bg-grayscale-gray5 rounded-full flex justify-center items-center gap-2.5 transition-opacity',
          'text-grayscale-gray60', // SVG 아이콘 색상
          isPrevDisabled
            ? 'opacity-40 '
            : 'hover:bg-grayscale-gray10', // (tailwind.config.js에 gray10이 있다는 가정)
        )}
      >
        {/* [수정] Figma div 아이콘 -> 인라인 SVG로 교체 */}
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      {/* 2. 단계 표시 (예: 1/2) */}
      <div className="justify-start text-grayscale-gray90 text-xl font-normal font-['Tmoney_RoundWind'] leading-8 select-none">
        {currentStep}/{totalSteps}
      </div>

      {/* 3. 다음 버튼 */}
      <button
        type="button"
        onClick={handleNext}
        disabled={isNextDisabled}
        aria-label="다음"
        className={twMerge(
          'w-10 h-10 bg-grayscale-gray5 rounded-full flex justify-center items-center gap-2.5 transition-opacity',
          'text-grayscale-gray60',
          isNextDisabled
            ? 'opacity-40 '
            : 'hover:bg-grayscale-gray10', // [수정] 오타 수정
        )}
      >
        {/* [수정] Figma div 아이콘 -> 인라인 SVG로 교체 */}
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>
  );
}

