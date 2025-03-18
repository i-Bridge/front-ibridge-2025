// src/app/parent/home/page.tsx
import Weekly from "./weekly";
import DateSelector from "./monthSelector";
import DailyQuestionList from "@/components/Question/DailyQuestionList"; // DailyQuestionList 컴포넌트 import
//슬라이딩


export default function HomePage() {
  return (
    <div className="flex justify-center w-full px-4">
    <div className=" min-h-screen w-[680px] pt-16">
      {/* 회색빛 직사각형 (레이아웃 가이드용) */}
      
      {/* 날짜 선택 UI */}
      <div className="absolute top-[136px] left-[315px] mb-3">
        <DateSelector />
      </div>

      {/* 주간 요소 */}
      <Weekly />
      <div  className="mt-8 ml-16 mr-16">
      <DailyQuestionList />
      
      </div>
      

    </div>
    </div>
  );
}



