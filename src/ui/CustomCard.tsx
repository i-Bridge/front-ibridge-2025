'use client';

import type { ReactNode } from 'react';

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
      className={`
        self-stretch p-10 rounded-3xl
        inline-flex  justify-start items-center gap-3
        ${className}
        ${
          onClick ? 'cursor-pointer' : ''
        } // onClick이 있으면 커서를 포인터로 변경
        
      `}
    >
      {children}
    </div>
  );
};

export default CustomCard;
