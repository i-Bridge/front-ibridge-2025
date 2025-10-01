'use client';

import { useEffect, useState } from 'react';
import { useScheduledSubjects } from '@/hooks/parentHome/useScheduledSubjects';
import SubjectTitleEdit from './SubjectTitleEdit';
import Loading from '../UI/LoadingAnim';
import { ScheduledSubject } from '@/types/index';

export default function ScheduledList() {
  const { subjects: fetchedSubjects, loading } = useScheduledSubjects();
  const [subjects, setSubjects] = useState<ScheduledSubject[]>([]);

  useEffect(() => {
    if (fetchedSubjects) {
      setSubjects(fetchedSubjects);
    }
  }, [fetchedSubjects]);

  if (loading) return <Loading />;

  if (!subjects || subjects.length === 0)
    return (
      <div className="text-center text-gray-500 mt-3 text-sm">
        예정된 질문이 없습니다.
      </div>
    );

  return (
    <div className="w-full max-w-2xl mx-auto space-y-2">
      {subjects.map((subject) => (
        <div
          key={subject.subjectId}
          className="p-2 mt-2 rounded-lg bg-gray-50 flex flex-col"
        >
          {/* 날짜를 박스 왼쪽 상단에 작게 표시 */}
          <span className="text-gray-400 text-xs mb-1">{subject.date}</span>

          <SubjectTitleEdit
            subjectId={subject.subjectId}
            subjectTitle={subject.subjectTitle}
            subjectDate={subject.date}
          />
        </div>
      ))}
    </div>
  );
}
