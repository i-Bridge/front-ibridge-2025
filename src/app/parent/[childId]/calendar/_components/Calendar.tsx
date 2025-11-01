'use client';

import { useEffect, useState, useRef } from 'react';
import { EmotionId, EMOTIONS } from '@/constants/emotions'; // EMOTIONS 상수 사용
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
  const [emotions, setEmotions] = useState<EmotionId[]>(
    defaultemotions.map((e) => Number(e)),
  );

  // useRef로 이전 연/월 추적
  const prevYearMonthRef = useRef({ year: today.getFullYear(), month: today.getMonth() + 1 });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const startMonth = startOfMonth(currentDate);
  const endMonth = endOfMonth(currentDate);
  const signupMonthStart = startOfMonth(signup);
  const currentMonthStart = startOfMonth(today);

  const isCurrentMonth = startMonth.getTime() === currentMonthStart.getTime();
  const isSignupMonth = startMonth.getTime() === signupMonthStart.getTime();

  // 연/월 변경 시 감정 데이터 다시 불러오기
  useEffect(() => {
    const prev = prevYearMonthRef.current;
    if (year !== prev.year || month !== prev.month) {
      setEmotions([]); // 로딩 상태로 전환

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
      prevYearMonthRef.current = { year, month }; // 이전 값 갱신
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
      {/* [!!] 수정: gap-5 -> gap-2, w-8 h-8 -> w-10 h-10 (날짜와 정렬 맞춤) */}
      <div className="grid grid-cols-7 text-center font-medium mb-2 gap-2">
        {WEEKDAYS.map((d) => (
          <div
            className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center text-sm"
            key={d}
          >
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 표시 */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day) => {
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
            dayColorClass = 'text-gray-400';
          } else {
            const emotionID = emotions[dayNumber - 1] ?? null;
            const emotion = EMOTIONS.find((e) => e.id === emotionID);

            // [!!] 수정: emotion.icon을 컴포넌트로 렌더링
            if (emotion) {
              const EmotionIcon = emotion.icon; // 아이콘 컴포넌트 가져오기
              content = (
                <>
                  {/* 요청하신대로 아이콘 컴포넌트 사용 */}
                  <EmotionIcon className="w-8 h-8 transition-opacity duration-200 group-hover:opacity-20" />
                  {/* 호버 시 날짜 표시 (기존 로직 유지) */}
                  <span className="absolute opacity-0 transition-opacity duration-200 group-hover:opacity-100 text-sm font-semibold">
                    {dayNumber}
                  </span>
                </>
              );
            }
            
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