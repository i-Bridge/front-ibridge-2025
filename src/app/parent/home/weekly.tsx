// src/app/parent/home/weekly.tsx // 일주일치 버튼, 데이터에 따른 버튼 모양


"use client";

import { useDateStore } from "@/store/date/dateStore";
import { useEffect, useRef } from "react";

export default function Weekly() {
  const { selectedDate, setSelectedDate } = useDateStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const [year, month, selectedDay] = selectedDate.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();

  // 현재 날짜 가져오기 (오늘 날짜)
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1; // 월은 0부터 시작하므로 +1
  const todayDay = today.getDate();

  const handleClick = (day: number) => {
    setSelectedDate(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  };

  useEffect(() => {
    // 선택한 날짜가 변경될 때, 버튼을 가운데로 스크롤
    const selectedButton = containerRef.current?.querySelector(".selected");
    if (selectedButton) {
      selectedButton.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [selectedDate]);

  return (
    <div className="w-[600px] overflow-x-auto scrollbar-hide flex" ref={containerRef}>
      <div className="flex space-x-2">
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const isSelected = day === selectedDay;
          const isToday = year === todayYear && month === todayMonth && day === todayDay; // 오늘 날짜 체크

          return (
            <button
              key={day}
              className={`w-10 h-10 flex items-center justify-center rounded-full shadow-md 
                ${isSelected ? "bg-pink-500 text-white selected" : "bg-blue-500 text-white"}
                ${isToday ? "bg-yellow-400 text-black font-bold" : ""}`} // 오늘 날짜에 노란색 배경 추가
              onClick={() => handleClick(day)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
