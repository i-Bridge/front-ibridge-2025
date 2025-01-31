// src/components/Question/AnswerAnalysis.tsx
// 특정 질문의 분석 결과 및 답변 영상 

import { useQuestionStore } from "@/store/QuestionStore";

interface AnswerAnalysisProps {
  question: string;
}

export default function AnswerAnalysis({ question }: AnswerAnalysisProps) {
  const { selectedQuestions, toggleQuestion } = useQuestionStore();

  return (
    <div className="mt-4 p-4 border rounded-md bg-gray-100">
      <h3 className="text-xl font-semibold">질문: {question}</h3>
      <p>이곳은 해당 질문에 대한 답변 분석 결과가 표시됩니다.</p>

      {/* 엑스 버튼을 눌러서 해당 컴포넌트를 숨김 */}
      <button
        onClick={() => toggleQuestion(question)} // 엑스 버튼 클릭 시 상태 토글
        className="text-red-500 mt-2"
      >
        ❌
      </button>
    </div>
  );
}
