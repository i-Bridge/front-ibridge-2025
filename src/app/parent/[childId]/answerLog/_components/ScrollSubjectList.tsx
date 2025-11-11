// /app/parent/[childId]/answerLog/_components/SubjectList.tsx

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useSubjectStore } from '@/store/useSubjectStore';
import { useSubjectsInfinite } from '@/hooks/parentHome/useSubjectsInfinite';
import { Subject } from '@/types/index';

import AnalysisList from '../../_components/Question/AnalysisList';
import { DotWaves } from '@/ui/loading/DotWaves';
import { Text } from '@/ui/Text';

// [수정] 새로 만든 렌더러 컴포넌트를 import 합니다.
import SubjectListRenderer from './SubjectListRenderer'; 

type Props = {
  initialSubjects: Subject[];
};

/**
 * Subject 리스트의 데이터 페칭, 상태 관리, 무한 스크롤 로직을 담당하는
 * 컨테이너 컴포넌트입니다.
 */
export default function ScrollSubjectList({ initialSubjects }: Props) {
  // [유지] 모든 훅 로직은 컨테이너가 담당합니다.
  const { selectedSubjectId, showPanels, setShowPanels } =
    useSubjectStore();

  const { allSubjects, loading, loadNext, hasNext, initFirstPage } =
    useSubjectsInfinite();

  const observerRef = useRef<IntersectionObserver | null>(null);

  // [유지] 초기 데이터 세팅 useEffect
  useEffect(() => {
    if (initialSubjects) {
      initFirstPage(initialSubjects);
    }
  }, [initialSubjects, initFirstPage]);

  // [유지] 애니메이션 상태 관리 useEffect
  useEffect(() => {
    if (selectedSubjectId) {
      setShowPanels(true);
    } else {
      setShowPanels(false);
    }
  }, [selectedSubjectId, setShowPanels]);

  // [유지] 무한스크롤 IntersectionObserver 로직
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

  

  // [추가] 렌더러에게 전달할 상태값들을 계산합니다.
  const isLoading = loading && allSubjects.length === 0;
  const isEmpty = !loading && allSubjects.length === 0;

  return (
    <div className="relative overflow-x-hidden mx-auto flex justify-center min-h-[600px] ">
      {/* 왼쪽 영역ㅐ */}
      <div className="w-full gap-4 mb-10 ">
        
        {/* [수정] 렌더링 로직을 SubjectListRenderer 컴포넌트로 위임합니다. */}
        <SubjectListRenderer
          subjects={allSubjects}
          lastItemRef={observeLastSubject}
          isLoading={isLoading}
          isEmpty={isEmpty}
        />

        {/* [유지] 무한스크롤 하단의 로딩/끝 표시는 컨테이너에 둡니다. */}
        <div className="w-full flex justify-center items-center mt-10">
          {/* [수정] 초기 로딩(isLoading)이 아닐 때만 하단 로더를 보여줍니다. */}
          {loading && !isLoading && <DotWaves className="bg-grayscale-gray30" />}
          {!hasNext && !loading && (
            <Text variant={'body04'} className="text-grayscale-gray40">
              마지막 질문입니다.
            </Text>
          )}
        </div>
      </div>

      {/* 오른쪽 패널 (동일) */}
      {showPanels && selectedSubjectId && (
        <div
          className={`min-w-[400px] ml-10 flex-grow flex-1 items-stretch animate-slide-in-right
          transition-transform duration-300 ease-in-out`}
        >
          <AnalysisList />
        </div>
      )}
    </div>
  );
}