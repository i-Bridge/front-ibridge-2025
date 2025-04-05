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
    <div className="relative  p-4 rounded-md ">
      

      {/* 답변 분석 내용 */}
      <div className="flex gap-6 ">
        {/* 왼쪽: 7:4 비율의 영상이 들어갈 자리 */}
        <div className="   bg-gray-400 rounded-md">
          {/* 예시로 영상 URL 추가, 필요시 실제 영상 삽입 */}
          <iframe
            className="w-full h-full rounded-md"
            src=""
            title="아이의 답변 영상"
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* 오른쪽: 글 영역 */}
        <div className=" relative mr-2">
          {/*
          <div className="absolute top-2 left-8 transform -translate-x-1/2 flex justify-center gap-3">
             원 5개를 배치 
            <div className="absolute top-4 left-1 w-8 h-8 bg-blue-500 rounded-full"></div>
            <div className="absolute left-24 w-10 h-10 bg-green-500 rounded-full"></div>
            <div className="absolute top-7 left-11 w-12 h-12 bg-red-500 rounded-full"></div>
            <div className="absolute left-28 top-12 w-6 h-6 bg-yellow-500 rounded-full"></div>
            <div className="absolute left-9  w-6 h-6 bg-purple-500 rounded-full"></div>
          </div>
*/}
          <p className="font-black text-sm  mt-0 mb-3">답변 분석 결과</p>
          <p className="w-[300]">아이는 창의적인 활동을 즐기며 자신의 생각을 자유롭게 표현하는 것을 중요하게 여깁니다.
          자신만의 목표를 구체적으로 세우고 꾸준히 노력하려는 성향을 보입니다.
</p>
        </div>
      </div>
    </div>
  );
  
}
