// /app/parent/[childId]/answerLog/_components/SubjectList.tsx

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useSubjectStore } from '@/store/useSubjectStore';
import { useSubjectsInfinite } from '@/hooks/parentHome/useSubjectsInfinite';
import { Subject } from '@/types/index';

import AnalysisList from '../../_components/Question/AnalysisList';
import { DotWaves } from '@/ui/loading/DotWaves';
import { Text } from '@/ui/Text';
import SubjectListRenderer from './SubjectListRenderer';
import PopupOverlay from '@/ui/Modal/PopupOverlay';

type Props = {
  initialSubjects: Subject[];
};

/**
 * Subject 리스트의 데이터 페칭, 상태 관리, 무한 스크롤 로직을 담당하는
 * 컨테이너 컴포넌트입니다.
 */
export default function ScrollSubjectList({ initialSubjects }: Props) {
  // [유지] 모든 훅 로직은 컨테이너가 담당합니다.
  const { selectedSubjectId, setSelectedSubjectId, showPanels, setShowPanels } =
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

  // x 버튼 클릭 시 selectedSubjectId를 null로 설정하여 팝업을 닫습니다.
  const handleClose = () => {
    setSelectedSubjectId(null);
    setShowPanels(false);
  };

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

      {/* 오른쪽 패널 (동일) */}
      {showPanels && selectedSubjectId && (
        <PopupOverlay onClose={handleClose}>
          <div className="px-10 w-auto">
            <div className="bg-white flex flex-col justify-start items-start rounded-[40px] relative  lg:max-w-7xl w-full max-h-[90vh] overflow-hidden">
              {/* 모달 헤더 */}
              {/* 팝업 컨텐츠 */}
              <div
                className="flex flex-col h-[60vh] overflow-y-auto p-4"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 오른쪽 패널 (AnalysisList) - lg에서만 나란히 표시 */}
                {showPanels && selectedSubjectId && <AnalysisList />}

              </div>
            </div>
          </div>
        </PopupOverlay>
      )}
    </div>
  );
}
