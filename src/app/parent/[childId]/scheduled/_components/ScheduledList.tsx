'use client';

import { useEffect } from 'react';
import { useScheduledSubjects } from '@/hooks/parentHome/useScheduledSubjects';
import SubjectTitleEdit from './SubjectTitleEdit';
import ScheduledSkeleton from './ScheduledSkeleton';

export default function ScheduledList() {
  const { subjects, loading, refetch } = useScheduledSubjects();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (!subjects || loading) return <ScheduledSkeleton />;

//subject 예정된 거 없을 시 오류 처리

  return (
    // 'space-y-4'로 카드 간의 간격을 줍니다.
    <div className="w-full flex flex-col self-stretch gap-3">
      {subjects.map((subject) => {
        // 날짜 구분 로직 제거 (날짜는 이제 카드 내부에 표시)
        // 기존 div 래퍼 제거 (SubjectTitleEdit이 카드 자체임)
        return (
          <SubjectTitleEdit
            key={subject.subjectId}
            subjectId={subject.subjectId}
            subjectTitle={subject.subjectTitle}
            date={subject.date} // ✅ 날짜 prop 전달
          />
        );
      })}
    </div>
  );
}