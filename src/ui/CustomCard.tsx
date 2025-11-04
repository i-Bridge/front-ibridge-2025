'use client';

import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge'; // 1. twMerge 함수를 직접 임포트합니다.

/**
 * 래핑된 컨텐츠에 패딩, 둥근 모서리를 적용하는
 * 공용 카드 컴포넌트입니다.
 *
 * onClick prop이 전달되면 Button과 동일한
 * 호버 오버레이 효과(hover:bg-black/5)가 적용됩니다.
 *
 * @example
 * // 1. 기본 효과: px-10 py-10 rounded-3xl',
        'flex flex-col justify-start items-center gap-3
 * <CustomCard>
 * <Text>내용물</Text>
 * </CustomCard>
 *
 * @example
 * // 2. onClick prop 전달 (호버 효과 적용)
 * <CustomCard onClick={() => console.log('Clicked!')}>
 * <Text>클릭 가능한 카드</Text>
 * </CustomCard>
 */
interface CustomCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const CustomCard = ({ children, className = '', onClick }: CustomCardProps) => {
  return (
    <div
      onClick={onClick}
      // 2. twMerge 함수로 클래스를 병합합니다.
      className={twMerge(
        // --- 1. 기본 스타일 ---
        'w-full self-stretch px-10 py-10 rounded-3xl',
        'flex flex-col justify-start items-center gap-3',
        className,
        // --- 2. 조건부 스타일 (onClick이 있을 때) ---
        onClick
          ? [
              // 배열로 여러 클래스 그룹을 전달
              'cursor-pointer',
              // [추가] Button과 동일한 호버 오버레이 스타일
              'relative', // pseudo-element 위치 기준
              'overflow-hidden', // 오버레이를 카드 둥근 모서리(rounded-3xl)에 맞게 자름
              'isolate', // z-index 스태킹 컨텍스트 생성
              "after:content-['']", // 가상 요소 생성
              'after:absolute',
              'after:inset-0', // 오버레이가 카드 전체를 덮도록
              'after:bg-black/5', // 5% 검은색 오버레이 (Button과 동일하게)
              'after:opacity-0', // 평소에는 투명
              'after:transition-opacity', // 부드러운 전환
              'hover:after:opacity-100', // 호버 시 오버레이 표시
            ]
          : '', // onClick이 없으면 아무 클래스도 추가하지 않음

        // --- 3. Prop으로 받은 커스텀 스타일 ---
      )}
    >
      {children}
    </div>
  );
};

export default CustomCard;
