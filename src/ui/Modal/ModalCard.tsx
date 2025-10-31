// components/ModalCard.tsx

import type { ReactNode } from 'react';

// 모달 카드 컴포넌트 - className prop으로 추가 스타일링 가능

type ModalCardProps = {
  children: ReactNode;
  className?: string;
  /** 테두리(outline) 노출 여부 (기본값: true) */
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
const ModalCard = ({ children, className = '', hasBorder = true }: ModalCardProps) => {
  
  // 🔑 hasBorder가 true일 때만 테두리 클래스를 적용
  const borderClasses = hasBorder
    ? 'outline outline-1 outline-offset-[-1px] outline-grayscale-gray20 p-10 '
    : '';

  return (
    <div className='w-[480px]'>
    <div
      className={`
       w-full bg-white
        flex self-stretch flex-col justify-start items-start  rounded-[40px] gap-10
         ${borderClasses} 
        ${className} 
      `}
    >
      {children}
    </div>
    </div>
  );
};

export default ModalCard;