import type { ReactNode } from 'react';

// 모달 카드 Header 컴포넌트 - className prop으로 추가 스타일링 가능

type ModalHeaderProps = {
  children: ReactNode;
  className?: string;
};

const ModalHeader = ({ children, className = '' }: ModalHeaderProps) => {
  return (
    <div
      className={`
        self-stretch flex flex-col justify-center items-center w-full px-10 pt-12 pb-5 gap-3
        ${className} 
      `}
    >
      {children}
    </div>
  );
};

export default ModalHeader;