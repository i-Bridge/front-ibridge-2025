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
    <div className="  mt-2 overflow-x-auto scrollbar-custom flex max-w-2xl" ref={containerRef}  >
      <div className="border border-i-lightgrey rounded-full flex space-x-3 mt-4 mb-2 p-2 ">
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const isSelected = day === selectedDay;
          const isToday = year === todayYear && month === todayMonth && day === todayDay; // 오늘 날짜 체크
  
          
          return (
            <button
              key={day}
              className="w-11 h-11 flex items-center justify-center rounded-[20px] "
              onClick={() => handleClick(day)}
            >
              <span
                className={`w-full h-full flex items-center justify-center rounded-[20px]  shadow-md
                  ${isSelected ? "bg-i-yellow border-2 border-i-orange text-white" : `bg-i-lightpurple text-white`} 
                  ${isToday ? "bg-i-orange text-white font-bold" : ""}`} // 오늘 날짜는 오렌지색 유지
              >
                {day}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
  
}
