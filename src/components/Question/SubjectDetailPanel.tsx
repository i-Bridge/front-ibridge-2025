'use client';

import { useSubjectStore } from '@/store/question/subjectStore';
import { useSubjectData } from '@/hooks/home/useSubjectData';
import QuestionList from './QuestionList';
import AnalysisList from './AnalysisList';

export default function SubjectDetailPanel() {
  const { selectedSubjectId } = useSubjectStore();
  const { subject, questions, loading } = useSubjectData(); // 인자 없이 사용

  if (!selectedSubjectId) return null;
  if (loading || !subject) return <div className="mt-4">불러오는 중...</div>;

  return (
    <div className="mt-4 border rounded-lg p-4 bg-gray-50">
      <QuestionList questions={questions || []} />
      <AnalysisList />
    </div>
  );
}
