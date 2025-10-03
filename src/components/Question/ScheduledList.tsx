'use client';

import { useEffect } from 'react';
import { useScheduledSubjects } from '@/hooks/parentHome/useScheduledSubjects';
import SubjectTitleEdit from './SubjectTitleEdit';
import Loading from '../UI/LoadingAnim';

export default function ScheduledList() {
  const { subjects, loading, refetch } = useScheduledSubjects();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (loading) return <Loading />;

  if (!subjects || subjects.length === 0)
    return (
      <div className="text-center text-gray-500 mt-3 text-sm">
        예정된 질문이 없습니다.
      </div>
    );

  return (
    <div className="w-full max-w-2xl mx-auto space-y-2 px-4 mt-2 mb-10">
      {subjects.map((subject, idx) => {
        const prevDate = idx > 0 ? subjects[idx - 1].date : null;
        const showDateDivider = prevDate !== subject.date;

        return (
          <div key={subject.subjectId}>
            {showDateDivider && (
              <div className="text-gray-400 text-sm mt-4">{subject.date}</div>
            )}

            <div className="p-2 mt-2 rounded-lg bg-gray-100 transition-all hover:bg-orange-100">
              <SubjectTitleEdit
                subjectId={subject.subjectId}
                subjectTitle={subject.subjectTitle}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
