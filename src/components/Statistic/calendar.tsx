// src/app/parent/calendar/calendar.tsx
'use client';

import { useEffect, useState } from 'react';
import { useDateStore } from '@/store/date/dateStore';

export default function Calendar() {
  const { selectedDate, setSelectedDate } = useDateStore();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // 1~12
  const [daysInMonth, setDaysInMonth] = useState(0);
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(0); // 첫날 요일 (0: 일요일)

  useEffect(() => {
    // 현재 월의 총 일수 구하기
    const lastDay = new Date(year, month, 0).getDate();
    setDaysInMonth(lastDay);

    // 현재 월의 1일이 무슨 요일인지 확인
    const firstDay = new Date(year, month - 1, 1).getDay();
    setFirstDayOfWeek(firstDay);

    // 현재 선택된 날짜가 해당 월에 없는 경우 1일로 변경
    const selectedDay = selectedDate?.split('-')[2] || '01';
    const adjustedDay = Math.min(parseInt(selectedDay, 10), lastDay)
      .toString()
      .padStart(2, '0');
    setSelectedDate(
      `${year}-${month.toString().padStart(2, '0')}-${adjustedDay}`,
    );
  }, [year, month, selectedDate, setSelectedDate]);

  return (
    <div className="p-4 border rounded-md w-[400px]">
      {/* 연도 & 월 선택 */}
      <div className="flex justify-between items-center mb-2">
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border p-1 rounded-md"
        >
          {Array.from(
            { length: 10 },
            (_, i) => new Date().getFullYear() - 5 + i,
          ).map((y) => (
            <option key={y} value={y}>
              {y}년
            </option>
          ))}
        </select>
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border p-1 rounded-md"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {m}월
            </option>
          ))}
        </select>
      </div>

      {/* 요일 표시 */}
      <div className="grid grid-cols-7 gap-1 text-center font-semibold">
        <div className="text-red-500">Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div className="text-blue-500">Sat</div>
      </div>

      {/* 날짜 버튼 */}
      <div className="grid grid-cols-7 gap-1 p-2 border-t">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="w-12 h-12"></div> // 빈 칸 채우기
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const today = new Date().toISOString().split('T')[0];
          const dateString = `${year}-${month.toString().padStart(2, '0')}-${(
            i + 1
          )
            .toString()
            .padStart(2, '0')}`;

          return (
            <button
              key={dateString}
              className={`w-12 h-12 border rounded-md transition ${
                selectedDate === dateString ? 'bg-blue-500 text-white' : ''
              } ${dateString === today ? 'border-2 border-red-500' : ''}`}
              onClick={() => setSelectedDate(dateString)}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* {selectedDate && <DailyQuestionList />} */}
    </div>
  );
}
