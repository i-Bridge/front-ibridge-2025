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
        p-5 gap-2.5 overflow-hidden
        ${mobileAbsolute ? 'fixed bottom-0 left-0 w-full lg:static lg:w-auto' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default ModalFooter;
