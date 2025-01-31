// src/app/parent/home/weekly.tsx // 일주일치 버튼, 데이터에 따른 버튼 모양

/* 수정 사안
 - ssr,csr고려 날짜 버튼, 질문 리스트는 csr, 나머지는 다 ssr이도록
 - 선택 날짜 년도 등 상세 설정 되도록
 - 현재 일자가 가운데에 오도록, 스크롤바도 가운데
 - 
*/
'use client'

import { useDateStore } from "@/store/DateStore";
import DailyQuestionList from "@/components/Question/DailyQuestionList";

export default function Weekly() {
    const daysInMonth = 31; // 나중에 해당 월 일수로 바꾸기
    const { selectedDate, setSelectedDate } = useDateStore();
    return (
       /*가운데 컨테이너*/
    <div className="w-[600px] h-auto bg-beige-200 rounded-lg shadow-md overflow-hidden">
         {/* 가로 스크롤 구현 */}
        <div className="w-full h-full overflow-x-auto whitespace-nowrap flex items-center px-4 scrollbar-hide">
            {/* 날짜들의 가로 배열 구현 */}
          <div className="flex space-x-4 w-max">
             {/* 버튼 동적 생성 */}
            {Array.from({ length: daysInMonth }).map((_, index) => (
              <button
                key={index}
                className={`w-12 h-12 flex items-center justify-center bg-blue-500 text-white rounded-full shadow-md ${
              selectedDate === `${index + 1}` ? "bg-pink-500 text-white" : ""
            }`}
                onClick={() => setSelectedDate(`${index + 1}`)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        <div className="text-black "> {selectedDate && <DailyQuestionList />} </div>
        
    </div>
    );
  }
  
  