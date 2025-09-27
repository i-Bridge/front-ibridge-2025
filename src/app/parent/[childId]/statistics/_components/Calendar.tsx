'use client';

import { useEffect, useState } from 'react';
import { EmotionId, EMOTIONS } from '@/constants/emotions';
import { Fetcher } from '@/lib/fetcher';
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  getDay,
  startOfDay,
} from 'date-fns';

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일'];

interface CalendarProps {
  childId: string;
  defaultemotions: string[];
  signupDate: string;
}

export default function Calendar({
  childId,
  defaultemotions,
  signupDate,
}: CalendarProps) {
  const today = new Date();
  const signup = new Date(signupDate);

  const [currentDate, setCurrentDate] = useState(today);
  const [prevYearMonth, setPrevYearMonth] = useState({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });
  const [emotions, setEmotions] = useState<EmotionId[]>(
    defaultemotions.map((e) => Number(e)),
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const startMonth = startOfMonth(currentDate);
  const endMonth = endOfMonth(currentDate);
  const signupMonthStart = startOfMonth(signup);
  const currentMonthStart = startOfMonth(today);

  const isCurrentMonth = startMonth.getTime() === currentMonthStart.getTime();
  const isSignupMonth = startMonth.getTime() === signupMonthStart.getTime();

  // 연월 변경 시 API 호출
  useEffect(() => {
    if (year !== prevYearMonth.year || month !== prevYearMonth.month) {
      setEmotions([]); // 로딩 상태

      async function fetchEmotions() {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-01`;
        try {
          const res = await Fetcher<{ emotions: string[] }>(
            `/parent/${childId}/stat/emotion?date=${dateStr}`,
          );
          if (res.isSuccess && res.data?.emotions) {
            setEmotions(res.data.emotions.map((e) => Number(e)));
          } else {
            setEmotions([]);
          }
        } catch (err) {
          console.error(err);
          setEmotions([]);
        }
      }

      fetchEmotions();
      setPrevYearMonth({ year, month });
    }
  }, [year, month, childId]);

  const startDate = startOfWeek(startMonth, { weekStartsOn: 1 });
  const endDate = endOfWeek(endMonth, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const prevMonth = () => {
    if (!isSignupMonth) setCurrentDate(subMonths(currentDate, 1));
  };
  const nextMonth = () => {
    if (!isCurrentMonth) setCurrentDate(addMonths(currentDate, 1));
  };

  return (
    <div className="border p-4 rounded w-[350px]">
      {/* 상단: 이전/다음 화살표 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          disabled={isSignupMonth}
          className={`px-2 ${isSignupMonth ? 'opacity-40 ' : ''}`}
        >
          «
        </button>
        <span className="font-semibold">
          {format(currentDate, 'yyyy년 M월')}
        </span>
        <button
          onClick={nextMonth}
          disabled={isCurrentMonth}
          className={`px-2 ${isCurrentMonth ? 'opacity-40 ' : ''}`}
        >
          »
        </button>
      </div>

      {/* 요일 표시 */}
      <div className="grid grid-cols-7 text-center font-medium mb-2 gap-5">
        {WEEKDAYS.map((d) => (
          <div
            className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-sm"
            key={d}
          >
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 표시 */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day) => {
          // 이번 달 외 날짜는 공백
          if (day.getMonth() + 1 !== month)
            return <div key={day.toString()}></div>;

          const dayNumber = day.getDate();
          const isBeforeSignupDay =
            isSignupMonth &&
            startOfDay(day).getTime() < startOfDay(signup).getTime();
          const isFutureDay = isCurrentMonth && day > today;
          const isLoading = emotions.length === 0;

          let content: React.ReactNode = <span>{dayNumber}</span>;
          let dayColorClass = '';

          if (isLoading || isFutureDay || isBeforeSignupDay) {
            // 로딩, 미래, 가입 이전 날짜는 회색
            dayColorClass = 'text-gray-400';
          } else {
            // 가입 이후 날짜 또는 다른 달
            const emotionID = emotions[dayNumber - 1] ?? null;
            const emotion = EMOTIONS.find((e) => e.id === emotionID);
            if (emotion) {
              content = (
                <>
                  <span className="text-xl group-hover:opacity-20">
                    {emotion.emoji}
                  </span>
                  <span className="absolute opacity-0 group-hover:opacity-100 text-sm">
                    {dayNumber}
                  </span>
                </>
              );
            }
            // 주말 색상
            const isWeekend = getDay(day) === 0 || getDay(day) === 6;
            dayColorClass = isWeekend ? 'text-red-500' : '';
          }

          return (
            <div
              key={day.toString()}
              className={`relative w-10 h-10 flex items-center justify-center cursor-pointer group ${dayColorClass}`}
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
