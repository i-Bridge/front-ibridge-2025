// src/app/parent/[childId]/_components/Question/AnalysisListPopup.tsx

'use client';

import PopupOverlay from '@/ui/Modal/PopupOverlay';
import { Suspense, lazy } from 'react';
import RotatingSpinner from '@/ui/loading/RotatingSpinner';
import { cn } from '@/lib/utils';

type AnalysisPopupProps = {
  onClose: () => void;
};

const AnalysisList = lazy(() => import('./AnalysisList'));

export default function AnalysisPopup({ onClose }: AnalysisPopupProps) {
  return (
    // PopupOverlay가 전체화면 배경(bg-black/60)과 중앙 정렬/Z-index를 처리함
    <PopupOverlay onClose={onClose}>
      {/* Bottom Sheet / Overlay Container 
        - Mobile: w-96 (or w-full for better UX), rounded-t-[20px]
        - MD: w-[600px] or similar (반응형으로 확장)
      */}
      <div
        className={cn(
          "bg-white flex flex-col overflow-hidden relative shadow-xl transition-transform duration-300",
          
          // Mobile (Base Style based on your HTML)
          // w-96으로 고정하면 모바일 화면 폭에 따라 잘릴 수 있으므로 w-full max-w-md 등으로 유동성을 주는 것이 좋으나,
          // 요청하신 HTML 클래스(w-96 등)를 최대한 존중하여 적용합니다.
          "w-full md:w-96 h-[85vh] md:h-[720px] rounded-t-[20px] md:rounded-[20px]",
          
          // Position: Bottom aligned for mobile feel, centered via PopupOverlay for larger screens if needed
          "absolute bottom-0 md:relative md:bottom-auto"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모바일용 핸들바 (선택 사항) */}
        <div className="w-full h-6 relative bg-white shrink-0 flex justify-center items-center">
           <div className="w-20 h-1 bg-grayscale-gray20 rounded-[100px]" />
        </div>

        {/* 콘텐츠 영역 */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-full w-full">
                <RotatingSpinner variant="grayscale" />
              </div>
            }
          >
            <AnalysisList />
          </Suspense>
        </div>
      </div>
    </PopupOverlay>
  );
}