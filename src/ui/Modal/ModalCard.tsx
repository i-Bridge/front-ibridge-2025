'use client';

import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

// 모달 카드 컴포넌트 - className prop으로 추가 스타일링 가능

type ModalCardProps = {
  children: ReactNode;
  className?: string;
  hasBorder?: boolean;
};

/**
 * 모달 UI의 기본 카드 형태를 제공하는 컴포넌트입니다.
 * `hasBorder` prop을 통해 두 가지 주요 스타일을 제어합니다.
 *
 * @example
 * // 1. hasBorder={true} (기본값): 테두리, p-10, gap-10 적용
 * // (일반적인 확인/알림 모달에 사용)
 * // 적용 스타일: outline, p-10, gap-10
 *
 * // 2. hasBorder={false}: 테두리, p-10, gap-10 제거
 * // (CommonModal이 폼이나 스크롤 영역을 래핑할 때 사용)
 * // 적용 스타일: p-0, gap-0
 */
const ModalCard = ({
  children,
  className = '',
  hasBorder = true,
}: ModalCardProps) => {
  const borderClasses = hasBorder
    ? 'border border-1 border-grayscale-gray20 p-10  '
    : 'p-0';

  return (
    <div
      className={twMerge(
        'w-80 md:w-[480px] bg-white flex flex-col justify-start md:justify-center items-start rounded-3xl relative gap-10',
        borderClasses,
        className,
      )}
    >
        {children}
        </div>
    
  );
};

export default ModalCard;

