// /app/parent/[childId]/answerLog/_components/ScrollSubjectList.tsx

'use client';

import { useEffect, useRef, useCallback, Suspense, lazy } from 'react';
import { useSubjectStore } from '@/store/useSubjectStore';
import { useSubjectsInfinite } from '@/hooks/parentHome/useSubjectsInfinite';
import { Subject } from '@/types/index';
import { cn } from '@/lib/utils';

import { DotWaves } from '@/ui/loading/DotWaves';
import { Text } from '@/ui/Text';
import { XIcon } from '@/ui/icon/icon'; // 닫기 버튼 아이콘
import RotatingSpinner from '@/ui/loading/RotatingSpinner';
import AnswerLogSkeleton from './AnwerLogSkeleton';

// 모바일/태블릿용 팝업 컴포넌트
import AnalysisPopup from '../../_components/Question/AnalysisListPopup';

const SubjectListRenderer = lazy(() => import('./SubjectListRenderer'));
// 데스크탑 패널 내부 콘텐츠
const AnalysisList = lazy(() => import('../../_components/Question/AnalysisList'));

type Props = {
  initialSubjects: Subject[];
};

export default function ScrollSubjectList({ initialSubjects }: Props) {
  const { selectedSubjectId, setSelectedSubjectId, showPanels, setShowPanels } =
    useSubjectStore();

  const { allSubjects, loading, loadNext, hasNext, initFirstPage } =
    useSubjectsInfinite();

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (initialSubjects) {
      initFirstPage(initialSubjects);
    }
  }, [initialSubjects, initFirstPage]);

  useEffect(() => {
    if (selectedSubjectId) {
      setShowPanels(true);
    } else {
      setShowPanels(false);
    }
  }, [selectedSubjectId, setShowPanels]);

  const observeLastSubject = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNext) {
          loadNext();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, loadNext, hasNext],
  );

  const handleClose = () => {
    setSelectedSubjectId(null);
    setShowPanels(false);
  };

  const isLoading = loading && allSubjects.length === 0;
  const isPanelOpen = showPanels && selectedSubjectId;

  return (
    <div className="relative flex w-full justify-center overflow-x-hidden min-h-[600px]">
      
      {/* 왼쪽 리스트 영역 */}
      {/* lg: 패널이 열리면 mr-[600px]을 적용하여 리스트를 왼쪽으로 밀어냄(너비 축소) */}
      <div
        className={cn(
          "w-full gap-4 mb-10 transition-all duration-300 ease-in-out",
          isPanelOpen && "lg:mr-[600px]" 
        )}
      >
        <Suspense fallback={<AnswerLogSkeleton />}>
          <SubjectListRenderer
            subjects={allSubjects}
            lastItemRef={observeLastSubject}
            isLoading={isLoading}
          />
        </Suspense>

        <div className="w-full flex justify-center items-center mt-10">
          {loading && !isLoading && (
            <DotWaves className="bg-grayscale-gray30" />
          )}
          {!hasNext && !loading && (
            <Text variant={'body04'} className="text-grayscale-gray40">
              마지막 질문입니다.
            </Text>
          )}
        </div>
      </div>

      {/* 오른쪽 패널 / 팝업 영역 */}
      {isPanelOpen && (
        <>
          {/* 1. LG 화면용: In-Page Sidebar (오버레이 없음, 리스트 옆에 붙음) */}
          <div
            className={cn(
              "hidden lg:flex fixed top-0 right-0 h-full w-[600px] bg-white z-40 flex-col border-l border-grayscale-gray20 shadow-none transition-transform duration-300 ease-in-out",
              showPanels ? "translate-x-0" : "translate-x-full"
            )}
          >
            {/* 데스크탑 패널 헤더 */}
            <div className="px-10 pt-10 pb-5 flex justify-between items-center">
               {/* 필요하다면 타이틀 추가 */}
               <div className="w-6 h-6" /> {/* Spacer */}
               <button onClick={handleClose} className="text-grayscale-gray60 hover:text-black transition-colors">
                  <XIcon  />
               </button>
            </div>

            {/* 패널 내용 */}
            <div className="flex-1 overflow-y-auto px-10 pb-10">
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

          {/* 2. Mobile(~md) & Tablet(md) 화면용: 팝업 오버레이 */}
          <div className="lg:hidden">
            <AnalysisPopup onClose={handleClose} />
          </div>
        </>
      )}
    </div>
  );
}