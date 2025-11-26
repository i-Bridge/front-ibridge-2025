// src/app/parent/[childId]/_components/Question/SubjectPopup.tsx

'use client';

import { Button } from '@/ui/Button';
import SubjectListRenderer from '../../../answerLog/_components/SubjectListRenderer';
import AnalysisPopup from '../../../_components/Question/AnalysisListPopup';
import AnalysisList from '../../../_components/Question/AnalysisList';
import { Subject } from '@/types/index';
import { useSubjectStore } from '@/store/useSubjectStore';
import { useEffect, useState, Suspense, TouchEvent } from 'react';
import PopupOverlay from '@/ui/Modal/PopupOverlay';
import TitleComponent from '@/ui/Modal/TitleComponent';
import ModalHeader from '@/ui/Modal/ModalHeader';
import ModalFooter from '@/ui/Modal/ModalFooter';
import RotatingSpinner from '@/ui/loading/RotatingSpinner';
import { twMerge } from 'tailwind-merge';

interface SubjectPopupProps {
  category: string;
  positiveScore: number;
  onClose: () => void;
  subjects: Subject[];
}

export default function SubjectPopup({
  category,
  positiveScore,
  onClose,
  subjects,
}: SubjectPopupProps) {
  const { selectedSubjectId, showPanels, setShowPanels, setSelectedSubjectId } =
    useSubjectStore();

  const [isVisible, setIsVisible] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
    
    // 선택된 Subject가 있으면 패널 활성화
    if (selectedSubjectId) {
      setShowPanels(true);
    } else {
      setShowPanels(false);
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedSubjectId, setShowPanels]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setSelectedSubjectId(null);
      onClose();
    }, 300);
  };

  // --- 드래그 핸들러 (모바일용) ---
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    if (diff > 0) setDragY(diff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragY > 100) {
      handleClose();
    } else {
      setDragY(0);
    }
  };

  // 패널 활성화 여부
  const isPanelActive = showPanels && selectedSubjectId;

  return (
    <PopupOverlay onClose={handleClose}>
      <div
        className={twMerge(
          "bg-white flex flex-col justify-start items-stretch relative overflow-hidden",
          "transition-all ease-out",
          
          // [Mobile]: Bottom Sheet
          "w-full h-[85vh] rounded-t-[30px] rounded-b-none",
          
          // [Tablet (md)]: width 720px, Height 1000px, 둥근 모서리
          "md:w-[720px] md:h-[1000px] md:max-h-[95vh] md:rounded-[40px]",
          
          // [Desktop (lg)]: width 960px (더 넓게)
          "lg:w-[960px] lg:h-[1000px] lg:rounded-[24px]",

          isDragging ? "duration-0" : "duration-300",
          isVisible 
            ? "translate-y-0 opacity-100" 
            : "translate-y-full opacity-0 md:translate-y-0"
        )}
        style={{ 
          transform: isVisible && !isDragging ? undefined : `translateY(${dragY}px)` 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Handle (md 이상 숨김) */}
        <div 
          className="w-full h-8 bg-white flex justify-center items-center shrink-0 md:hidden cursor-grab active:cursor-grabbing touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
           <div className="w-16 h-1.5 bg-grayscale-gray20 rounded-full" />
        </div>

        <div className="flex flex-col w-full h-full px-6 pb-6 md:px-10 md:pb-10">
          {/* Header */}
          <ModalHeader className="pb-0 shrink-0">
            <TitleComponent
              title={category}
              subtitle={`긍정 ${positiveScore}%의 카테고리`}
              align="center"
            />
          </ModalHeader>

          {/* Content Wrapper */}
          <div className="flex flex-col flex-1 min-h-0 mt-6">
            
            {/* [Layout Logic]
              - md 이상(Tablet/Desktop): 가로 배치 (flex-row) -> 좌우 분할 뷰
              - md 미만(Mobile): 세로 배치 (flex-col) -> 리스트만 보임
            */}
            <div className="flex-1 w-full min-h-0 flex flex-col md:flex-row md:gap-0">
              
              {/* Left Panel: Subject List */}
              <div className={twMerge(
                "flex-1 h-full overflow-y-auto custom-scrollbar",
                // md 이상에서는 오른쪽 패널과 구분되도록 패딩 조정 가능
                "md:block md:pr-0",
              )}>
                <SubjectListRenderer
                  subjects={subjects}
                  isLoading={false}
                />
              </div>

              {/* Right Panel: Analysis List Embed */}
              {/* md 이상에서 패널이 활성화되면 우측에 표시 (오버레이 아님) */}
              {isPanelActive && (
                <div className="hidden md:block flex-1 h-full min-h-0 border-l border-grayscale-gray20">
                  <Suspense fallback={
                    <div className="w-full h-full flex justify-center items-center">
                      <RotatingSpinner variant='grayscale'/>
                    </div>
                  }>
                    {/* 내부 콘텐츠 (헤더, 리스트 등 포함된 컴포넌트) */}
                    <AnalysisList />
                  </Suspense>
                </div>
              )}
            </div>

            {/* Footer: Close Button */}
            <ModalFooter className="mt-6 shrink-0">
              <Button
                variant={'grayscale'}
                onClick={handleClose}
                className="w-full py-4 rounded-full"
              >
                닫기
              </Button>
            </ModalFooter>
          </div>
        </div>
      </div>

      {/* [Mobile Only Overlay]
        - md 이상에서는 위의 Right Panel(Split View)로 대체되므로 렌더링하지 않음
      */}
      <div className="md:hidden">
        {isPanelActive && (
          <Suspense fallback={<RotatingSpinner variant='grayscale'/>}>
            <AnalysisPopup onClose={() => setSelectedSubjectId(null)} />
          </Suspense>
        )}
      </div>
    </PopupOverlay>
  );
}