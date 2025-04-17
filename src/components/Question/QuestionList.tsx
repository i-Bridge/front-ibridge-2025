"use client";

import { useSubjectStore } from "@/store/question/subjectStore";

interface Question {
  questionId: number;
  text: string;
  video: string;
  answer: string;
}

interface Props {
  questions: Question[];
}

export default function QuestionList({ questions }: Props) {
  const { selectedQuestionId, setSelectedQuestionId } = useSubjectStore();

  return (
    <div className="space-y-2">
      {questions.map((q) => (
        <div
          key={q.questionId}
          onClick={() => setSelectedQuestionId(q.questionId)}
          className={`cursor-pointer border p-2 rounded-md ${
            selectedQuestionId === q.questionId ? "bg-yellow-100" : ""
          }`}
        >
          {/* 번호 추가: q1, q2 형태로 표시 */}
          <span className="font-semibold">q{q.questionId}. </span>
          {q.text}
        </div>
      ))}
    </div>
  );
}
