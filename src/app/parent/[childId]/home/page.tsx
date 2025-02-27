// src/app/parent/home/page.tsx
import Weekly from "./weekly";
import DateSelector from "./monthSelector";
import DailyQuestionList from "@/components/Question/DailyQuestionList"; // DailyQuestionList 컴포넌트 import



export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen pt-16">
      {/* 회색빛 직사각형 (레이아웃 가이드용) */}
      
      {/* 날짜 선택 UI */}
      <div className="mb-10">
        <DateSelector />
      </div>

      {/* 주간 요소 */}
      <Weekly />

      <div className="mt-10">
        <DailyQuestionList />
      </div>
    </main>
  );
}



