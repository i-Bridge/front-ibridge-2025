'use client';

import { useState, useEffect, useRef } from 'react';
import { useDateStore } from '@/store/date/dateStore';
import { useQuestionStore } from '@/store/question/selectedQuestionStore';
import AnswerAnalysis from '@/components/Question/AnswerAnalysis';
import { motion } from 'framer-motion';

const mockQuestions = {
  '2025-02-11': [
    { questionId: 1, question: '어떤 꿈을 가지고 있어?', isAnswer: false },
    { questionId: 2, question: '아이의 이야기: 나 오늘 학교에서 선생님께 칭찬받았어', isAnswer: false },
  ],
  '2025-02-12': [
    { questionId: 1, question: '어떤 꿈을 가지고 있어? ', isAnswer: false },
  ],
};

export default function DailyQuestionList() {
  const { selectedDate } = useDateStore();
  const { selectedQuestions, toggleQuestion } = useQuestionStore();
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  // 슬라이딩 애니메이션 완료 후 스크롤을 처리할 ref
  const answerAnalysisRef = useRef<HTMLDivElement | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const currentDate = selectedDate || today;
  const questions = mockQuestions[currentDate] || [];

  const handleQuestionClick = (question: string) => {
    setActiveQuestion(question);
    toggleQuestion(question);
  };

  // 슬라이딩 애니메이션 후 자동으로 스크롤 내리기
  const handleAnimationComplete = () => {
    if (answerAnalysisRef.current) {
      // 분석 결과가 화면에 표시되면 자동으로 스크롤 내리기
      const offset = 100; // 추가로 아래로 내릴 거리
      const elementPosition = answerAnalysisRef.current.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="mt-4 w-full max-w-xl flex justify-center items-start">
      <div className="flex w-full h-full">
        {/* 질문 목록 */}
        <motion.ol
          initial={{ x: 0 }}
          animate={{ x: activeQuestion ? '-50%' : '0%' }}
          transition={{ duration: 0.3 }}
          className="space-y-3 mt-6 w-full flex-shrink-0"
        >
          {questions.map((question) => (
            <li
              key={question.questionId}
              className="text-base cursor-pointer hover:font-semibold"
              onClick={() => handleQuestionClick(question.question)}
            >
              <div className="flex items-start">
                <span className="font-bold text-lg inline-block w-[30px]">Q.</span>
                <span className="flex-1 break-words">{question.question}</span>
              </div>
            </li>
          ))}
        </motion.ol>

        {/* 답변 분석 */}
        <motion.div
          initial={{ x: '0%', opacity: 1  }}
          animate={{ x: activeQuestion ? '-60%' : '150%' , opacity: activeQuestion ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-full flex-shrink-0 rounded-md border-2 bg-gray-50 p-4"
          onAnimationComplete={handleAnimationComplete}  // 애니메이션 완료 후 스크롤 처리
        >
          {activeQuestion && (
            <div ref={answerAnalysisRef}>
              <button className="mb-4 text-blue-500" onClick={() => setActiveQuestion(null)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-gray-600">
                  <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
                </svg>
              </button>
              <AnswerAnalysis question={activeQuestion} />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
