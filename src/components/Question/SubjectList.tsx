'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useSubjectStore } from '@/store/useSubjectStore';
import SubjectTitleEdit from './SubjectTitleEdit';
import AnalysisList from './AnalysisList';
import Loading from '../UI/LoadingAnim';
import DateFormatter from '@/hooks/dateFormatter';
import { useSubjectsInfinite } from '@/hooks/parentHome/useSubjectsInfinite';
import { Subject } from '@/types/index';

type Props = {
  initialSubjects: Subject[]; // SSR로 초기 1페이지 subjects
};

const SubjectList = ({ initialSubjects }: Props) => {
  const { selectedSubjectId, setSelectedSubjectId, showPanels, setShowPanels } =
    useSubjectStore();

  const { allSubjects, loading, loadNext, hasNext, initFirstPage } =
    useSubjectsInfinite();

  const [animating, setAnimating] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);

  // 초기 subjects 세팅
  useEffect(() => {
    if (initialSubjects) {
      initFirstPage(initialSubjects);
    }
  }, [initialSubjects, initFirstPage]);

  // 패널 열기/닫기 애니메이션
  useEffect(() => {
    if (selectedSubjectId) {
      setShowPanels(true);
      setAnimating(true);
    } else {
      setAnimating(true);
      setShowPanels(false);
    }
  }, [selectedSubjectId, setShowPanels]);

  // 무한스크롤 IntersectionObserver
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

  // 질문 클릭 시
  const handleClick = (subjectId: number) => {
    setSelectedSubjectId(selectedSubjectId === subjectId ? null : subjectId);
  };

  return (
    <div className="relative overflow-x-hidden mx-auto flex justify-center min-h-[600px]">
      {/* 왼쪽 영역 - Subject List + Detail */}
      <div
        className={`flex flex-col justify-start z-10 
          ${animating ? 'animate-slide-in-right' : 'animate-slide-in-left'}
          transition-transform ease-in-out`}
      >
        <div className="w-full max-w-2xl space-y-2 px-4 mb-10 mt-2">
          {loading && allSubjects.length === 0 ? (
            <Loading />
          ) : allSubjects.length === 0 ? (
            <div className="text-center text-gray-500 mt-3 text-sm">
              질문이 없습니다.
            </div>
          ) : (
            allSubjects.map((subject, idx) => {
              const prevDate = idx > 0 ? allSubjects[idx - 1].date : null;
              const showDateDivider = prevDate !== subject.date;

              return (
                <div key={subject.subjectId}>
                  {' '}
                  {showDateDivider && (
                    <div className="text-gray-400 text-sm mt-4 mb-2">
                      {' '}
                      {DateFormatter(subject.date)}{' '}
                    </div>
                  )}{' '}
                  <div
                    onClick={() => handleClick(subject.subjectId)}
                    className={`p-2 mb-8 rounded-lg transition-all ${selectedSubjectId === subject.subjectId ? ' bg-gray-200' : 'bg-orange-50'} ${subject.answer ? 'cursor-pointer hover:bg-gray-200' : 'bg-orange-50'} `}
                    ref={
                      idx === allSubjects.length - 1 ? observeLastSubject : null
                    }
                  >
                    {' '}
                    {subject.answer ? (
                      <div>{subject.subjectTitle}</div>
                    ) : (
                      <SubjectTitleEdit
                        subjectId={subject.subjectId}
                        subjectTitle={subject.subjectTitle}
                        subjectDate={subject.date}
                      />
                    )}{' '}
                  </div>{' '}
                </div>
              );
            })
          )}

          {/* 무한스크롤 로딩/끝 표시 */}
          {loading && (
            <div className="flex justify-center py-4">
              <Loading />
            </div>
          )}
          {!hasNext && !loading && (
            <div className="text-center text-gray-400 text-sm py-4">
              마지막 질문입니다.
            </div>
          )}
        </div>
      </div>

      {showPanels && selectedSubjectId && (
        <div
          className={`flex items-stretch animate-slide-in-right
          transition-transform duration-300 ease-in-out`}
        >
          {/* 세로 구분선 */}
          <div className="w-px bg-gray-300 mx-1" />

          {/* 오른쪽 패널 */}
          <div className="pl-16 z-10">
            <div className="relative bg-white overflow-auto">
              <AnalysisList />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectList;
