import type { ReactNode } from 'react';

type ModalFooterProps = {
  children: ReactNode;
  className?: string;
  /** 모바일에서 화면 하단 고정 여부 */
  mobileAbsolute?: boolean;
};

const ModalFooter = ({
  children,
  className = '',
  mobileAbsolute = false,
}: ModalFooterProps) => {
  return (
    <div
      className={`
        self-stretch flex justify-center items-center w-full
         gap-2.5 overflow-hidden md:p-0 p-5
        ${mobileAbsolute ? 'fixed bottom-0 left-0 w-full min-w-80 md:static  md:p-0 p-5' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default ModalFooter;
