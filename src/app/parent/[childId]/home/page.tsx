// src/app/parent/home/page.tsx
import Weekly from "./weekly";
import DateSelector from "./monthSelector";
import AIComment from "./aiComment";
import DailyQuestionList from "@/components/Question/DailyQuestionList"; // DailyQuestionList 컴포넌트 import
//슬라이딩


export default function HomePage() {
  return (
    <div className="flex flex-col justify-center items-center w-full pt-3">
      <AIComment/>
    <div className=" min-h-screen w-[680px] pt-8">
      
      <DateSelector />
      <Weekly />
      <div  className="mt-8 ml-16 mr-16">
      <DailyQuestionList />
      </div>
      

    </div>
    </div>
  );
}



