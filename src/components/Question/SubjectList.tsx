'use client';

import { useEffect, useState } from 'react';
import { useSubjectStore } from '@/store/question/subjectStore';
import { useHomeData } from '@/hooks/home/useHomeData';
import SubjectDetailPanel from './SubjectDetailPanel';
import SubjectTitleEdit from './SubjectTitleEdit';
import AnalysisList from './AnalysisList';

type Subject = {
  subjectId: number;
  subjectTitle: string;
  answer: boolean;
};

type Props = {
  initialSubjects: Subject[];
};

const SubjectList = ({ initialSubjects }: Props) => {
  const { selectedSubjectId, setSelectedSubjectId } = useSubjectStore();
  const { subjects: fetchedSubjects, loading } = useHomeData();
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);

  const [showPanels, setShowPanels] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (fetchedSubjects) {
      setSubjects(fetchedSubjects);
    }
  }, [fetchedSubjects]);

  useEffect(() => {
    if (selectedSubjectId) {
      setShowPanels(true);
      setAnimating(true);
    } else {
      setAnimating(true);
      // 패널 닫을 때는 애니메이션 후 DOM 제거
      setTimeout(() => {
        setShowPanels(false);
        setAnimating(false);
      }, 0); // duration과 맞추기
    }
  }, [selectedSubjectId]);

  const handleClick = (subjectId: number) => {
    setSelectedSubjectId(selectedSubjectId === subjectId ? null : subjectId);
  };

  return (
    <div className="relative overflow-x-hidden w-[80%] mx-auto flex justify-center min-h-[600px]  ">
      {/* 왼쪽 영역 - Subject List + Detail */}
      <div
        className={`w-1/2 flex flex-col justify-start  z-10 
          ${animating ? 'animate-slide-in-right ' : 'animate-slide-in-left'}
          transition-transform  ease-in-out 
        `}
      >
        <div className="w-full max-w-2xl space-y-2 px-4 mb-10 mt-2">
          {loading ? (
            <div className="flex items-center justify-center space-x-2 mt-4">
              <span className="w-2 h-2 bg-gray-200 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-gray-200 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-gray-200 rounded-full animate-bounce" />
            </div>
          ) : subjects.length === 0 ? (
            <div className="text-center text-gray-500 mt-3 text-sm">
              질문이 없습니다.
            </div>
          ) : (
            subjects.map((subject) => (
              <div key={subject.subjectId}>
                <div
                  onClick={() => {
                    if (subject.answer) {
                      handleClick(subject.subjectId);
                    }
                  }}
                  className={`p-2 mt-4 rounded-lg transition-all  bg-orange-50
                    ${
                      selectedSubjectId === subject.subjectId
                        ? ' font-semibold'
                        : subject.answer
                          ? 'hover:font-semibold'
                          : ''
                    } 
                    ${subject.answer ? 'cursor-pointer' : ''}`}
                >
                  {subject.answer ? (
                    <div>{subject.subjectTitle}</div>
                  ) : (
                    <SubjectTitleEdit
                      subjectId={subject.subjectId}
                      subjectTitle={subject.subjectTitle}
                    />
                  )}
                </div>
                {subject.answer && selectedSubjectId === subject.subjectId && (
                  <div className="mt-2">
                    <SubjectDetailPanel />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {selectedSubjectId && (
        <div
          className={`flex items-stretch animate-slide-in-right
      transition-transform duration-300 ease-in-out`}
        >
          {/* 세로 구분선 */}
          <div className="w-px bg-gray-300 mx-1" />

          {/* 오른쪽 패널 */}
          <div className=" pl-16 z-10">
            <div className="relative bg-white  overflow-auto">
              <AnalysisList />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectList;
