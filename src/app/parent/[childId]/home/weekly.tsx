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
    } else {
      // 오늘 날짜가 선택된 날짜로 없으면 오늘 날짜로 스크롤
      const todayButton = containerRef.current?.querySelector(".today");
      if (todayButton) {
        todayButton.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }, [selectedDate]);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = 100; // 한 번에 스크롤할 양
      const currentScroll = containerRef.current.scrollLeft;
      const newScroll = direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount;
      containerRef.current.scrollTo({ left: newScroll, behavior: "smooth" });
    }
  };

  return (
    <div className="mt-2 relative flex max-w-2xl">
      {/* 왼쪽 화살표 버튼 */}
      <button
        onClick={() => scroll("left")}
        className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-i-lightgray shadow-md absolute left-[-50] top-[25]"
      >
        &#8592;
      </button>
  
      <div className="mt-2 overflow-x-hidden flex border border-i-lightgrey rounded-full" ref={containerRef}>
        {/* 날짜 버튼들 */}
        <div className="flex space-x-3 mt-2 mb-2 p-2">
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const isSelected = day === selectedDay;
            const isToday = year === todayYear && month === todayMonth && day === todayDay; // 오늘 날짜 체크
  
            return (
              <button
                key={day}
                className="w-11 h-11 flex items-center justify-center rounded-[20px]"
                onClick={() => handleClick(day)}
              >
                <span
                  className={`w-full h-full flex items-center justify-center rounded-[20px] shadow-md
                    
                     
                      ${isToday ? "bg-i-orange text-white font-bold today" : 
                        isSelected ? " bg-i-lightgreen border-4 border-i-orange text-white selected" : "bg-i-lightgreen text-white"}`}
                >
                  {day}
                </span>
              </button>
            );
          })}
        </div>
      </div>
  
      {/* 오른쪽 화살표 버튼 */}
      <button
        onClick={() => scroll("right")}
        className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-i-lightorange shadow-md absolute right-[-50] top-[25]"
      >
        &#8594;
      </button>
    </div>
  );
  
