'use client';

import { useEffect, useState } from 'react';
import { EmotionId, EMOTIONS, type EmotionKey } from '@/lib/constants';
import { Fetcher } from '@/lib/fetcher';

interface CalendarProps {
  childId: string;
  defaultemotions: EmotionId[]; // string 대신 정확하게 EmotionKey로 타입 지정
}

export default function Calendar({ childId, defaultemotions }: CalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1~12
  const [emotions, setEmotions] = useState<EmotionId[]>(defaultemotions);

  // 선택한 연월이 바뀔 때 API 호출
  useEffect(() => {
    async function fetchEmotions() {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-01`;
      try {
        const res = await Fetcher<{ emotions: EmotionId[] }>(
          `/parent/${childId}/stat/emotion?date=${dateStr}`,
        );

        if (res.isSuccess && res.data?.emotions) {
          setEmotions(res.data.emotions);
        } else {
          setEmotions([]); // 비어있으면 빈 배열로 초기화
        }
      } catch (err) {
        console.error(err);
      }
    }

    // 초기 달(day) 제외하고 월 변경 시 호출
    if (year !== today.getFullYear() || month !== today.getMonth() + 1) {
      fetchEmotions();
    }
  }, [year, month, childId]);

  // 달력 날짜 계산
  const daysInMonth = new Date(year, month, 0).getDate();
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="border p-4 rounded w-[400px]">
      {/* 상단: 년도/월 선택 */}
      <div className="flex space-x-2 mb-4">
        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {Array.from({ length: 5 }, (_, i) => today.getFullYear() - 2 + i).map(
            (y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ),
          )}
        </select>
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {m}월
            </option>
          ))}
        </select>
      </div>

      {/* 달력 그리기 */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, idx) => {
          // idx가 emotions 배열 범위를 벗어나면 undefined
          const emotionID = emotions[idx] ?? null;
          const emotion = EMOTIONS.find((e) => e.id === emotionID);
          console.log(emotionID,idx);
          return (
            <div
              key={day}
              className="relative w-10 h-10 flex items-center justify-center border rounded cursor-pointer group"
            >
              {emotion ? (
                <>
                  <span className="text-xl">{emotion.emoji}</span>
                  <span className="absolute opacity-0 group-hover:opacity-100 text-sm">
                    {day}
                  </span>
                </>
              ) : (
                <span>{day}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
