import type { ReactNode } from 'react';

// 모달 카드 Footer 컴포넌트 - className prop으로 추가 스타일링 가능

type ModalFooterProps = {
  children: ReactNode;
  className?: string;
};

const ModalFooter = ({ children, className = '' }: ModalFooterProps) => {
  return (
    <div
      className={`
        self-stretch flex justify-center items-center w-full ]
        p-5 gap-2.5 overflow-hidden
        ${className} 
      `}
    >
      {children}
    </div>
  );
};

export default ModalFooter;