'use client';

import { useState, useEffect } from 'react';
import { useSubjectStore } from '@/store/useSubjectStore';
import AnalysisList from './AnalysisList';
import Loading from '../UI/LoadingAnim';
import DateFormatter from '@/hooks/dateFormatter';


type Props = {
  keywords: string; // API 응답으로 받은 subjects
  childId: string;
};

interface CategorySubject {
  subjectId: number;
  subjectTitle: string;
  date: string;
}

const CategorySubjectList = ({ childId, keywords }: Props) => {
  const { selectedSubjectId, setSelectedSubjectId, showPanels, setShowPanels } =
    useSubjectStore();

  const [subjects, setSubjects] = useState<CategorySubject[]>([]);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(true);

  // 애니메이션 제어
  useEffect(() => {
    if (selectedSubjectId) {
      setShowPanels(true);
      setAnimating(true);
    } else {
      setAnimating(true);
      setShowPanels(false);
    }
  }, [selectedSubjectId, setShowPanels]);

   useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/parent/${childId}/stat/${encodeURIComponent(keywords)}`);
        const data = await res.json();
        if (data.isSuccess) {
          setSubjects(data.data.subjects || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [childId, keywords]);

  // 질문 클릭 시
  const handleClick = (subjectId: number) => {
    setSelectedSubjectId(selectedSubjectId === subjectId ? null : subjectId);
    // 필요하다면 readSubject 호출 추가
  };

  return (
    <div className="relative overflow-x-hidden mx-auto flex justify-center min-h-[400px]">
      {/* 왼쪽 영역 - Subject List */}
      <div
        className={`flex flex-col justify-start z-10 
          ${animating ? 'animate-slide-in-right' : 'animate-slide-in-left'}
          transition-transform ease-in-out`}
      >
        <div className="w-full max-w-2xl space-y-2 px-4 mb-10 mt-2">
          {subjects.length === 0 ? (
            <div className="text-center text-gray-500 mt-3 text-sm">
              질문이 없습니다.
            </div>
          ) : (
            subjects.map((subject, idx) => {
              const prevDate = idx > 0 ? subjects[idx - 1].date : null;
              const showDateDivider = prevDate !== subject.date;

              return (
                <div key={subject.subjectId}>
                  {showDateDivider && (
                    <div className="text-gray-400 text-sm mt-4 mb-2">
                      {DateFormatter(subject.date)}
                    </div>
                  )}

                  <div
                    onClick={() => handleClick(subject.subjectId)}
                    className={`p-2 mb-8 rounded-lg transition-all 
                      ${selectedSubjectId === subject.subjectId ? ' bg-gray-200' : 'bg-orange-50'}
                      `}
                  >
            
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
 {showPanels && selectedSubjectId && (
        <AnalysisList />
      )}
      
    </div>
  );
};

export default CategorySubjectList;
