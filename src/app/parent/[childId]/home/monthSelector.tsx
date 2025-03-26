"use client";

import { useState } from "react";
import { useDateStore } from "@/store/date/dateStore";

const months = [
  "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"
];

export default function MonthSelector() {
  const { selectedDate, setSelectedDate } = useDateStore();
  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();
  
  // 과거 4개월 + 현재 + 미래 1개월
  const availableMonths = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(currentMonthIndex - 4 + i);
    return { name: months[date.getMonth()], index: date.getMonth(), year: date.getFullYear() };
  });

  const [selectedMonth, setSelectedMonth] = useState(availableMonths[4]); // 현재 달이 기본
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (month) => {
    setSelectedMonth(month);
    setSelectedDate(`${month.year}-${String(month.index + 1).padStart(2, "0")}-01`);
    setIsOpen(false);
  };

  return (
    <div className="relative w-40 flex flex-col items-start">
      <div className="flex items-center space-x-2">
        
        <div 
          className="font-bold text-lg text-gray-600  cursor-pointer p-2 hover:bg-i-lightgrey rounded-full flex items-center" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="  font-medium mr-2">{selectedMonth.year}</span>
          <span className=" font-bold">{selectedMonth.name}</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-gray-400">
  <path fill-rule="evenodd" d="M11.47 4.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1-1.06 1.06L12 6.31 8.78 9.53a.75.75 0 0 1-1.06-1.06l3.75-3.75Zm-3.75 9.75a.75.75 0 0 1 1.06 0L12 17.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
</svg>

          
        </div>
      </div>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-full bg-white border rounded-md shadow-lg z-10">
          {availableMonths.map((month) => (
            <div 
              key={month.index} 
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(month)}
            >
              {month.year} {month.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}