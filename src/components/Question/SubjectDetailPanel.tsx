'use client';

import { useSubjectStore } from '@/store/question/subjectStore';
import { useSubjectData } from '@/hooks/home/useSubjectData';
import QuestionList from './QuestionList';


export default function SubjectDetailPanel() {
  const { selectedSubjectId } = useSubjectStore();
  const { questions, loading } = useSubjectData(); // 인자 없이 사용
  if (loading) console.log('로딩중');
  if (!selectedSubjectId) return null;
  if (loading)
    return (
      <div className="flex items-center justify-center space-x-2 mt-2">
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
      </div>
    );

  return (
    <div className=" rounded-lg p-4  flex justify-between">
      
        <QuestionList questions={questions || []} />
      
      
    </div>
  );
}
