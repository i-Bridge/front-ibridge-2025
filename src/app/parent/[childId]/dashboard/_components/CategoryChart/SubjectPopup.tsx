'use client';

import { Button } from '@/ui/Button';
import SubjectListRenderer from '../../../answerLog/_components/SubjectListRenderer';
import AnalysisPopup from '../../../_components/Question/AnalysisListPopup';
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

/**
 * 'N개의 대화' 클릭 시 보일 팝업 (반응형 모달/바텀시트)
 */
export default function SubjectPopup({
  category,
  positiveScore,
  onClose,
  subjects,
}: SubjectPopupProps) {
  const { selectedSubjectId, showPanels, setShowPanels, setSelectedSubjectId } =
    useSubjectStore();

  // [1] 애니메이션 및 드래그 상태 관리
  const [isVisible, setIsVisible] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  useEffect(() => {
    // 마운트 시 등장 애니메이션
    requestAnimationFrame(() => setIsVisible(true));

    // 패널 표시 여부 초기화
    if (selectedSubjectId) {
      setShowPanels(true);
    } else {
      setShowPanels(false);
    }

    // 스크롤 방지
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedSubjectId, setShowPanels]);

  const handleClose = () => {
    setIsVisible(false); // 닫기 애니메이션
    setTimeout(() => {
      setSelectedSubjectId(null);
      onClose();
    }, 300);
  };

  // [2] 드래그 이벤트 핸들러 (모바일용)
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    if (diff > 0) setDragY(diff); // 아래로만 드래그 허용
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragY > 100) {
      handleClose();
    } else {
      setDragY(0); // 복귀
    }
  };

  return (
    <PopupOverlay onClose={handleClose}>
      <div
        // [3] 반응형 컨테이너 스타일
        // 모바일: w-full, 하단 고정, 윗면 둥글게
        // md: w-[720px], h-[1000px]
        // lg: w-[960px], h-[1000px]
        className={twMerge(
          "bg-white flex flex-col justify-start items-stretch relative overflow-hidden",
          "transition-all ease-out",
          
          // 모바일 스타일 (Bottom Sheet)
          "w-full h-[85vh] rounded-t-[30px] rounded-b-none",
          
          // 태블릿 (md) 스타일
          "md:w-[720px] md:h-[1000px] md:max-h-[95vh] md:rounded-[40px]",
          
          // 데스크탑 (lg) 스타일
          "lg:w-[960px] lg:h-[1000px]",

          // 드래그 및 애니메이션 효과
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
        {/* [4] 모바일 전용 핸들바 */}
        <div 
          className="w-full h-8 bg-white flex justify-center items-center shrink-0 md:hidden cursor-grab active:cursor-grabbing touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
           <div className="w-16 h-1.5 bg-grayscale-gray20 rounded-full" />
        </div>

        <div className="flex flex-col w-full h-full px-6 pb-6 md:px-10 md:pb-10">
          {/* 모달 헤더 */}
          <ModalHeader className="pb-0 shrink-0">
            <TitleComponent
              title={category}
              subtitle={`긍정 ${positiveScore}%의 카테고리`}
              align="center"
            />
          </ModalHeader>

          {/* 팝업 컨텐츠 */}
          <div className="flex flex-col flex-1 min-h-0 mt-6">
            {/* 컨텐츠 영역 레이아웃:
              - 모바일: 세로 배치 (flex-col)
              - LG 이상: 가로 배치 (flex-row) 
            */}
            <div className="flex-1 w-full min-h-0 gap-6 flex flex-col lg:flex-row">
              
              {/* 왼쪽 패널 (SubjectList) */}
              <div className="flex-1 h-full overflow-y-auto custom-scrollbar pr-2">
                <SubjectListRenderer
                  subjects={subjects}
                  isLoading={false}
                />
              </div>

              {/* 오른쪽 패널 (AnalysisList) - lg에서만 옆으로 옴 */}
              {showPanels && selectedSubjectId && (
                <div className="flex-1 h-full min-h-0 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
                  <Suspense fallback={<RotatingSpinner variant='grayscale'/>}>
                    <AnalysisPopup onClose={() => setSelectedSubjectId(null)} />
                  </Suspense>
                </div>
              )}
            </div>

            {/* 하단 닫기 버튼 */}
            <ModalFooter className="mt-6 shrink-0">
              <Button
                variant={'grayscale'}
                onClick={handleClose}
                className="w-full py-4  rounded-full"
              >
                닫기
              </Button>
            </ModalFooter>
          </div>
        </div>
      </div>
    </PopupOverlay>
  );
}