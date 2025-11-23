'use client';

import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface PopupOverlayProps {
  children: ReactNode;
  onClose: () => void;
  // 오버레이 자체에 스타일이 필요할 경우를 대비
  className?: string; 
}

const PopupOverlay = ({ children, onClose, className }: PopupOverlayProps) => {
  return (
    <div
      className={twMerge(
        // [1] 배치 설정
        // - flex, items-end: 모바일은 바닥 정렬 (Bottom Sheet)
        // - md:items-center: PC(md이상)는 중앙 정렬 (Modal)
        "fixed inset-0 z-50 flex items-end justify-center md:items-center",
        // [2] 배경 및 패딩
        // - p-0: 모바일은 여백 없음 (바닥에 밀착)
        // - md:p-10: PC는 화면 끝과 간격 유지
        "bg-black/60 backdrop-blur-sm p-0 md:p-10 transition-all duration-300",
        className
      )}
      onClick={onClose}
    >
      {/* 모바일에서 가로폭을 꽉 채우기 위해 w-full 적용.
         PC에서는 자식(ModalCard)의 크기를 따름 
      */}
      <div 
        className="w-full md:w-auto flex justify-center"
        onClick={(e) => e.stopPropagation()} 
      >
        {children}
      </div>
    </div>
  );
};

export default PopupOverlay;