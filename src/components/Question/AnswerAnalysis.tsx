"use client";

import { useEffect } from "react";
import { useQuestionStore } from "@/store/question/selectedQuestionStore";

interface AnswerAnalysisProps {
  question: string;
}

export default function AnswerAnalysis({ question }: AnswerAnalysisProps) {
  const { selectedQuestions, toggleQuestion } = useQuestionStore();

  useEffect(() => {
    if (typeof window === "undefined") return; // 서버 실행 방지

    // 2025/2/11에 해당하는 질문 1, 2, 3을 기본 추가
    const defaultQuestions = ["질문1", "질문2", "질문3"];
    const selectedSet = new Set(selectedQuestions);

    defaultQuestions.forEach((q) => {
      if (!selectedSet.has(q)) {
        toggleQuestion(q);
      }
    });
  }, []);

  // Set을 활용하여 선택된 질문인지 확인
  const selectedSet = new Set(selectedQuestions);
  if (!selectedSet.has(question)) {
    return <h3 className="text-xl font-semibold">질문: {question}</h3>;
  }

  return (
    <div className="relative mt-4 p-4 border rounded-md bg-gray-100">
      {/* 닫기 버튼을 오른쪽 상단에 배치 */}
      <button
        onClick={() => toggleQuestion(question)}
        className="absolute top-2 right-2 text-red-500 text-sm"
      >
        ❌
      </button>
      <h3 className="text-xl font-semibold">질문: {question}</h3>
      <p>이곳은 해당 질문에 대한 답변 분석 결과가 표시됩니다.</p>
    </div>
  );
}
