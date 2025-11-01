'use client';

import type { ReactNode } from 'react';

/**
 * 팝업을 위한 공용 오버레이 컴포넌트입니다.
 * 화면 중앙에 자식 요소를 배치하고, 배경을 어둡고 흐릿하게 만듭니다.
 */

interface PopupOverlayProps {
  children: ReactNode;
  onClose: () => void;
}

const PopupOverlay = ({ children, onClose }: PopupOverlayProps) => {
  return (
    // 1. 오버레이 (배경)
    // - fixed: 화면 전체에 고정
    // - z-50: 다른 요소들 위에 표시 (필요시 더 높게)
    // - flex, items-center, justify-center: 자식 요소를 화면 정중앙에 배치
    // - bg-black/50: 50% 투명도의 검은색 배경
    // - backdrop-blur-sm: 배경 블러 처리
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose} // 배경 클릭 시 닫기 함수 호출
    >
      {/* 2. 팝업 컨텐츠 영역 (children)
        - 배경의 onClick(onClose) 이벤트가 팝업 내부로 전파되는 것을 막습니다.
        - (이걸 안 하면 팝업 내부를 클릭해도 팝업이 닫혀버립니다)
      */}
      <div
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default PopupOverlay;