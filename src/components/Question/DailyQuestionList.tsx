// src/components/Question/DailyQuestionList.tsx
'use client';

import { useState, useEffect } from 'react';
import { useDateStore } from '@/store/date/dateStore';
import { useQuestionStore } from '@/store/question/selectedQuestionStore';
import AnswerAnalysis from '@/components/Question/AnswerAnalysis';

const mockQuestions = {
  '2025-02-11': [
    { questionId: 1, question: '오늘 기분은 어때?', isAnswer: false },
    { questionId: 2, question: '학교에서 재미있었던 일은?', isAnswer: false },
    { questionId: 3, question: '가장 좋아하는 색깔은?', isAnswer: false },
  ],
  '2025-02-12': [
    { questionId: 1, question: '어제 본 꿈은?', isAnswer: false },
    { questionId: 2, question: '가장 친한 친구는 누구야?', isAnswer: false },
    { questionId: 3, question: '좋아하는 음식은?', isAnswer: false },
  ],
  // 더 많은 날짜별 목업 질문을 추가할 수 있습니다.
};

export default function DailyQuestionList() {
  const { selectedDate } = useDateStore();
  const { selectedQuestions, toggleQuestion } = useQuestionStore();

  // 선택된 날짜가 없다면, 오늘 날짜를 기본으로 사용
  const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD" 형식
  const currentDate = selectedDate || today;

  // 목업 데이터에서 선택된 날짜에 해당하는 질문 리스트 가져오기
  const questions = mockQuestions[currentDate] || [];

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold">{currentDate}일의 질문 리스트</h2>
      <ul className="mt-2 space-y-2">
        {questions.map((question) => (
          <li
            key={question.questionId}
            className={`cursor-pointer p-4 border rounded-md bg-white hover:bg-gray-200 
              ${selectedQuestions.has(question.question) ? 'border-blue-500 bg-blue-100' : 'border-gray-300'}`}
            onClick={() => toggleQuestion(question.question)} // 질문 클릭 시 상태 토글
          >
            {question.question}

            {/* 선택된 질문의 답변 분석을 해당 질문 아래에 표시 */}
            {selectedQuestions.has(question.question) && (
              <div className="mt-2">
                <AnswerAnalysis question={question.question} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
