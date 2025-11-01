'use client';

import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge'; // 1. twMerge 함수를 직접 임포트합니다.

/**
 * 래핑된 컨텐츠에 패딩, 둥근 모서리를 적용하는
 * 공용 카드 컴포넌트입니다.
 */

interface CustomCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const CustomCard = ({
  children,
  className = '',
  onClick,
}: CustomCardProps) => {
  return (
    <div
      onClick={onClick}
      // 2. 템플릿 리터럴 대신 twMerge 함수로 클래스를 병합합니다.
      className={twMerge(
        // 기본 스타일
        'w-full self-stretch px-10 py-10 rounded-3xl',
        'flex flex-col justify-start items-center gap-3',
        // 조건부 스타일 (onClick이 있을 때)
        onClick ? 'cursor-pointer' : '',
        // Prop으로 받은 커스텀 스타일
        className,
      )}
    >
      {children}
    </div>
  );
};

export default CustomCard;

