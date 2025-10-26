'use client';

import { useState, useEffect } from 'react';
import { useSubjectStore } from '@/store/useSubjectStore';
import AnalysisList from './AnalysisList';
import Loading from '../../ui/LoadingAnim';
import DateFormatter from '@/hooks/dateFormatter';
import { Fetcher } from '@/lib/fetcher';

type Props = {
  keywords: string;
  childId: string;
};

interface CategorySubject {
  subjectId: number;
  subjectTitle: string;
  date: string;
}

interface CategorySubjectResponse {
  subjects: CategorySubject[];
}

const CategorySubjectList = ({ childId, keywords }: Props) => {
  const { selectedSubjectId, setSelectedSubjectId, setShowPanels } =
    useSubjectStore();

  const [subjects, setSubjects] = useState<CategorySubject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const res = await Fetcher<CategorySubjectResponse>(
          `/parent/${childId}/stat/subject?keyword=${encodeURIComponent(keywords)}`,
        );
        const data = res.data;
        setSubjects(data?.subjects || []);
        setSelectedSubjectId(null);
        setShowPanels(false);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [childId, keywords, setSelectedSubjectId, setShowPanels]);

  const handleClick = (subjectId: number) => {
    setSelectedSubjectId(selectedSubjectId === subjectId ? null : subjectId);
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center min-h-[400px]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-2xl max-h-[70vh] overflow-y-auto p-2">
      {subjects.length === 0 ? (
        <div className="text-center text-gray-500 mt-3 text-sm">
          질문이 없습니다.
        </div>
      ) : (
        subjects.map((subject, idx) => {
          const prevDate = idx > 0 ? subjects[idx - 1].date : null;
          const showDateDivider = prevDate !== subject.date;

          return (
            <div key={subject.subjectId} className="mb-4">
              {showDateDivider && (
                <div className="text-gray-400 text-sm mt-4 mb-2">
                  {DateFormatter(subject.date)}
                </div>
              )}

              <div
                onClick={() => handleClick(subject.subjectId)}
                className={`p-2 rounded-lg cursor-pointer transition-all 
                ${
                  selectedSubjectId === subject.subjectId
                    ? 'bg-gray-200'
                    : 'bg-orange-200'
                }`}
              >
                {subject.subjectTitle}
              </div>

              {selectedSubjectId === subject.subjectId && (
                <div className="mt-2">
                  <AnalysisList />
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default CategorySubjectList;
