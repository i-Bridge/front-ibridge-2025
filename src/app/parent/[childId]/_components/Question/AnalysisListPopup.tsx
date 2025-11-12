'use client';

import PopupOverlay from '@/ui/Modal/PopupOverlay';
import { Suspense, lazy } from 'react';
import RotatingSpinner from '@/ui/loading/RotatingSpinner';

type AnalysisPopupProps = {
  onClose: () => void;
};

const AnalysisList = lazy(() => import('./AnalysisList'));

export default function AnalysisPopup({ onClose }: AnalysisPopupProps) {
  return (
    <PopupOverlay onClose={onClose}>
      <div className="bg-white flex flex-col justify-start items-start rounded-[40px] 
        relative lg:max-w-7xl lg:min-w-[768px] w-full max-h-[90vh] overflow-hidden min-h-[400px]"
      >
        <div
          className="flex flex-col h-[60vh] overflow-y-auto p-4"
          onClick={(e) => e.stopPropagation()}
        >
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
