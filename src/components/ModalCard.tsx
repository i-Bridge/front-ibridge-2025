import type { ReactNode } from 'react';

// 모달 카드 컴포넌트 - className prop으로 추가 스타일링 가능

type ModalCardProps = {
  children: ReactNode;
  className?: string;
};

const ModalCard = ({ children, className = '' }: ModalCardProps) => {
  return (
    
    <div
      className={`
        w-[480px] p-10 bg-white rounded-[40px]
        outline outline-1 outline-offset-[-1px] outline-gray-20
        flex flex-col justify-start items-start gap-10
        ${className} 
      `}
    >
      {/* 이 컴포넌트의 자식 요소(children)들은
        자동으로 flex-col(세로 정렬)과 gap-10(40px 간격)이 적용됩니다.
      */}
      {children}
    </div>
  );
};

export default ModalCard;