// src/app/parent/home/page.tsx
import Weekly from "./weekly";
import DailyQuestionList from "@/components/Question/DailyQuestionList";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen pt-16">
      {/* 회색빛 직사각형 (레이아웃 가이드용) */}
      <div className="absolute top-20 w-[90%] max-w-4xl h-[600px] bg-gray-100 opacity-50 rounded-lg z-[-1]" />

      {/* 주간 요소 */}
      <Weekly />

      {/* 일일 질문 리스트 */}
      <DailyQuestionList />
    </main>
  );
}


