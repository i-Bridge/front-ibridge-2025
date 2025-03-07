// src/app/parent/home/weekly.tsx // 일주일치 버튼, 데이터에 따른 버튼 모양


"use client";

import { useDateStore } from "@/store/date/dateStore";
import { useEffect, useRef, useState } from "react";

import { getMainInfo } from '@/api/todo';

export default function Weekly() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  
  // ✅ 컴포넌트가 마운트되면 API 요청 실행
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getMainInfo(); // ✅ API 호출
        setResponse(result.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "데이터를 불러오는 중 오류 발생");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // ✅ 빈 배열 → 페이지가 로드될 때 한 번만 실행

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
    <div className="w-[400px] overflow-x-auto scrollbar-custom  flex" ref={containerRef}>
      <div className="flex space-x-2 mt-5 mb-4">
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const isSelected = day === selectedDay;
          const isToday = year === todayYear && month === todayMonth && day === todayDay; // 오늘 날짜 체크

          return (
            <button
              key={day}
              className={`w-11 h-11 flex items-center justify-center rounded-[20px] shadow-md 
                ${isSelected ? "bg-i-lightpurple border-2 border-i-orange text-white selected" : "bg-i-lightpurple text-white"}
                ${isToday ? "bg-i-yellow text-black font-bold" : ""}`} // 오늘 날짜에 노란색 배경 추가
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
