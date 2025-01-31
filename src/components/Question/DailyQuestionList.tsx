// src/components/Question/DailyQuestionList.tsx
// 해당 일자의 질문 리스트

"use client";

import { useDateStore } from "@/store/DateStore";
import { useQuestionStore } from "@/store/QuestionStore";
import AnswerAnalysis from "@/components/Question/AnswerAnalysis";

const sampleQuestions = {
  "1": ["오늘 기분은 어때?", "학교에서 재미있었던 일은?", "가장 좋아하는 색깔은?"],
  "2": ["어제 본 꿈은?", "가장 친한 친구는 누구야?", "좋아하는 음식은?"],
};

export default function DailyQuestionList() {
  const { selectedDate } = useDateStore();
  const { selectedQuestions, toggleQuestion } = useQuestionStore();
  const questions = selectedDate ? sampleQuestions[selectedDate] || [] : [];

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold">{selectedDate}일의 질문 리스트</h2>
      <ul className="mt-2 space-y-2">
        {questions.map((question) => (
          <li
            key={question}
            className={`cursor-pointer ${selectedQuestions.has(question) ? "text-blue-500" : ""}`}
            onClick={() => toggleQuestion(question)} // 질문 클릭 시 상태 토글
          >
            {question}
          </li>
        ))}
      </ul>

      {/* 선택된 질문에 대한 AnswerAnalysis 컴포넌트 표시 */}
      {Array.from(selectedQuestions).map((question) => (
        <AnswerAnalysis key={question} question={question} />
      ))}
    </div>
  );
}
