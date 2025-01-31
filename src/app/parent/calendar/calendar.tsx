// src/app/parent/calendar/calendar.tsx
// 날짜버튼클릭, 상태관리, 날짜 관리 등 달력 컴포넌트
"use client";
"use client";

import { useDateStore } from "@/store/DateStore";
import DailyQuestionList from "@/components/Question/DailyQuestionList";

export default function Calendar() {
  const { selectedDate, setSelectedDate } = useDateStore();
  const daysInMonth = 31; // 예시: 31일까지 존재

  return (
    <div>
      
      <div className="grid grid-cols-7 gap-2 p-4 border rounded-md">
        {Array.from({ length: daysInMonth }, (_, i) => (
          <button
            key={i + 1}
            className={`w-12 h-12 border rounded-md ${
              selectedDate === `${i + 1}` ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => setSelectedDate(`${i + 1}`)} // 날짜 클릭 시 상태 변경
          >
            {i + 1}
          </button>
        ))}
      </div>

      {selectedDate && <DailyQuestionList />} {/* 날짜 선택 시 질문 리스트 표시 */}
    </div>
  );
}
