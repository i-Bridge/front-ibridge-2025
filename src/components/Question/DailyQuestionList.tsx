// src/components/Question/DailyQuestionList.tsx
'use client';

import { useState, useEffect } from 'react';
import { useDateStore } from '@/store/date/dateStore';
import { useQuestionStore } from '@/store/question/selectedQuestionStore';
import AnswerAnalysis from '@/components/Question/AnswerAnalysis';

const mockQuestions = {
  '2025-02-11': [
    { questionId: 1, question: '오늘 기분은 어때?', isAnswer: false },
    { questionId: 2, question: '제일 좋아하는 친구는 누구고 그 친구가 좋은 이유가 뭐야?', isAnswer: false },
    { questionId: 3, question: '가장 좋아하는 색깔은?', isAnswer: false },
  ],
  '2025-02-12': [
    { questionId: 1, question: '어제 본 꿈은?', isAnswer: false },
    ,
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
    <div className="mt-2">
      {/* */}
      
      <ol className="mt-5 space-y-3">
        {questions.map((question) => (
          <li
            key={question.questionId}
            className=" text-base "
            onClick={() => toggleQuestion(question.question)} // 질문 클릭 시 상태 토글
          >
            <div className="flex flex-col  ">
              <div className="flex items-start cursor-pointer hover:font-semibold">
                {/* Q. 부분 */}
                <span className="font-bold text-lg inline-block w-[30px] flex-shrink-0">Q.</span>
  
                {/* 질문 부분 */}
                <span className="flex-1 break-words">{question.question}</span>
              </div>
  
              {/* 선택된 질문의 답변 분석을 해당 질문 바로 아래에 표시 */}
              {selectedQuestions.has(question.question) && (
                <div className="mb-4 break-words">
                  <AnswerAnalysis question={question.question} />
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );  
}
