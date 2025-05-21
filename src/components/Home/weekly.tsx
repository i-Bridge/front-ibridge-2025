'use client';

import { useDateStore } from '@/store/date/dateStore';
import { useEffect, useRef } from 'react';

export default function Weekly() {
  const { selectedDate, setSelectedDate } = useDateStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const [year, month, selectedDay] = selectedDate.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();

  // 현재 날짜 가져오기 (오늘 날짜)
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1; // 월은 0부터 시작하므로 +1
  const todayDay = today.getDate();

  const handleClick = (day: number) => {
    setSelectedDate(
      `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    );
  };

  useEffect(() => {
    // 선택한 날짜가 변경될 때, 버튼을 가운데로 스크롤
    const selectedButton = containerRef.current?.querySelector('.selected');
    if (selectedButton) {
      selectedButton.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    } else {
      // 오늘 날짜가 선택된 날짜로 없으면 오늘 날짜로 스크롤
      const todayButton = containerRef.current?.querySelector('.today');
      if (todayButton) {
        todayButton.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }
  }, [selectedDate]);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = 100; // 한 번에 스크롤할 양
      const currentScroll = containerRef.current.scrollLeft;
      const newScroll =
        direction === 'left'
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;
      containerRef.current.scrollTo({ left: newScroll, behavior: 'smooth' });
    }
  };

  return (
    <div className=" relative flex max-w-2xl">
      {/* 왼쪽 화살표 버튼 */}
      <button
        onClick={() => scroll('left')}
        className="w-10 h-10 flex items-center justify-center rounded-full absolute left-[-40] top-[25]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6 text-gray-600"
        >
          <path
            fillRule="evenodd"
            d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div
        className="mt-2 overflow-x-hidden flex border border-i-lightgrey rounded-full"
        ref={containerRef}
      >
        {/* 날짜 버튼들 */}
        <div className="flex space-x-3 mt-2 mb-2 p-2">
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const isSelected = day === selectedDay;
            const isToday =
              year === todayYear && month === todayMonth && day === todayDay; // 오늘 날짜 체크

            return (
  <button
    key={day}
    className="w-11 h-11 flex items-center justify-center rounded-[20px]"
    onClick={() => handleClick(day)}
  >
    <span
      className={`w-full h-full flex items-center justify-center rounded-[20px]
        transition-shadow duration-200
        ${
          isToday
            ? 'bg-i-lightorange text-white  today'
            : isSelected
              ? 'border-4 border-orange-400 text-black selected'
              : 'text-black hover:bg-gray-100'
        }
        
      `}
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
        onClick={() => scroll('right')}
        className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 text-bold  absolute right-[-40] top-[27]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
