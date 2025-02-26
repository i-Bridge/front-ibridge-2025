"use client";

import { useState } from "react";
import { useDateStore } from "@/store/date/dateStore";

const months = [
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
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
        <span className="text-sm text-gray-500 font-medium">{selectedMonth.year}</span>
        <div 
          className="font-bold text-lg cursor-pointer p-2 hover:bg-gray-200 rounded-md" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedMonth.name}
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