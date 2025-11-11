/*
 * 파일 경로: src/app/parent/[childId]/calendar/_components/Calendar.tsx
 * (기존 Calendar.tsx 파일을 이 코드로 덮어쓰세요)
 */
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
  startOfDay,
} from 'date-fns';
import { cn } from '@/lib/utils'; // tailwind-merge 유틸리티
import { Text } from '@/ui/Text'; // 공통 Text 컴포넌트
import { Button } from '@/ui/Button'; // 공통 Button 컴포넌트
import ParentLayout from '../../_components/Layout/ParentLayout';

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일'];

interface CalendarProps {
  childId: string;
  defaultemotions: string[];
  mostEmotion: number[];
  signupDate: string;
}

// EMOTIONS 상수에 정의된 아이콘 컴포넌트의 타입을 가정합니다.
type EmotionIconComponent = React.FC<
  React.SVGProps<SVGSVGElement> & { className?: string }
>;

export default function Calendar({
  childId,
  defaultemotions,
  mostEmotion,
  signupDate,
}: CalendarProps) {
  // 날짜 비교의 일관성을 위해 startOfDay 사용
  const today = startOfDay(new Date());
  const signup = startOfDay(new Date(signupDate));

  const [currentDate, setCurrentDate] = useState(today);
  const [emotions, setEmotions] = useState<EmotionId[]>(
    defaultemotions.map((e) => Number(e)),
  );
  const [mostEmotionState, setMostEmotionState] = useState<EmotionId[]>(mostEmotion);

  const prevYearMonthRef = useRef({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 1-based month

  const startMonth = startOfMonth(currentDate);
  const endMonth = endOfMonth(currentDate);
  const signupMonthStart = startOfMonth(signup);
  const currentMonthStart = startOfMonth(today);

  const isCurrentMonth = startMonth.getTime() === currentMonthStart.getTime();
  const isSignupMonth = startMonth.getTime() === signupMonthStart.getTime();

  // 연/월 변경 시 감정 데이터 다시 불러오기 (기존 로직 유지)
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
            
            console.log('sdf',res);
          } else {
            setEmotions([]);
          }
        } catch (err) {
          console.error(err);
          setEmotions([]);
        }
      }

      fetchEmotions();
      prevYearMonthRef.current = { year, month };
    }
  }, [year, month, childId]);

  // 캘린더 날짜 배열 생성 (월요일 시작, 일요일 끝)
  const startDate = startOfWeek(startMonth, { weekStartsOn: 1 });
  const endDate = endOfWeek(endMonth, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Figma 구조(행 기반)에 맞게 날짜 배열을 7일(1주) 단위로 나눕니다.
  const weeks: Date[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  // 월 이동 핸들러
  const prevMonth = () => {
    if (!isSignupMonth) setCurrentDate(subMonths(currentDate, 1));
  };
  const nextMonth = () => {
    if (!isCurrentMonth) setCurrentDate(addMonths(currentDate, 1));
  };

  // 감정 아이콘 컴포넌트 가져오기
  const getEmotionIcon = (
    emotionId: EmotionId | null,
  ): EmotionIconComponent | null => {
    if (emotionId === null) return null;
    const emotion = EMOTIONS.find((e) => e.id === emotionId);
    if (emotion && typeof emotion.icon === 'function') {
      
      return emotion.icon;
      
    }
    return null;
  };

  const MostEmotionIcon = getEmotionIcon(mostEmotion[0]);
  console.log('emotion',mostEmotion[0]);
  console.log('emotion',MostEmotionIcon);

  // 감정 아이콘 배경색 클래스 가져오기 (constants/emotions.ts에 bgColor가 정의되어 있다고 가정)
  const getEmotionBgColor = (emotionId: EmotionId | null): string => {
    if (emotionId === null) return 'bg-white'; // 기본값
    const emotion = EMOTIONS.find((e) => e.id === emotionId);
    return emotion?.bgColor || 'bg-white'; // ex: 'bg-Other-mintLight'
  };

  return (
    // Figma 기준 최상위 컨테이너
    <ParentLayout
      title={
        <div className="w-full self-stretch justify-between flex gap-5">
        <div className="w-full self-stretch"> 
          <div className="flex items-center gap-3 mb-6 w-full">
            <Text
              variant="caption01"
              className="text-grayscale-gray60 whitespace-nowrap"
            >
              {format(currentDate, 'yyyy년 M월')}
            </Text>
            <Button
              onClick={prevMonth}
              disabled={isSignupMonth}
              variant="grayscale" // 버튼 스타일에 맞게 수정하세요
              className="w-8 h-8 p-1.5 bg-grayscale-gray10 rounded-[999px] inline-flex justify-center items-center"
            >
              {'<'}
            </Button>

            <Button
              onClick={nextMonth}
              disabled={isCurrentMonth}
              variant="grayscale" // 버튼 스타일에 맞게 수정하세요
              className="w-8 h-8 p-1.5 bg-grayscale-gray10 rounded-[999px] inline-flex justify-center items-center"
            >
              {'>'}
            </Button>
          </div>
          <Text variant={'title01'}>가장 많이 선택한 감정은</Text>
          </div>
          <div className="w-14 h-14 ml-2.5 mt-1.5 mb-6 relative rounded-[60px] overflow-hidden flex items-center justify-center bg-other-yellow-light">
            {MostEmotionIcon ? <MostEmotionIcon className="w-10 h-10" /> : null}
        </div>
        </div>
      }
    >
      {/* 월 이동 네비게이션 (기존 로직 + @/ui/Button, @/ui/Text 적용) */}

      {/* Figma 요일 헤더 */}
      <div className="self-stretch h-12 bg-Grayscale-gray5 border-b border-Grayscale-gray20 inline-flex justify-start items-center">
        {WEEKDAYS.map((d, index) => (
          <div
            key={d}
            className={cn(
              'flex-1 self-stretch p-2 flex justify-center items-center gap-2.5 overflow-hidden',
              index < WEEKDAYS.length - 1 && 'border-r border-Grayscale-gray20',
            )}
          >
            <Text className="text-grayscale-gray90 text-base font-['NPS_font'] leading-6">
              {d}
            </Text>
          </div>
        ))}
      </div>

      {/* Figma 캘린더 바디 (주 단위 행 렌더링) */}
      <div className="self-stretch flex-col justify-start items-start flex w-full">
        {weeks.map((week, weekIndex) => (
          <div
            key={weekIndex}
            className={cn(
              'self-stretch inline-flex justify-start items-center overflow-hidden',
              // 마지막 주를 제외하고 하단 테두리 적용
              weekIndex < weeks.length - 1 &&
                'border-b border-grayscale-gray20',
            )}
          >
            {week.map((day, dayIndex) => {
              const dayNumber = day.getDate();
              const dayStart = startOfDay(day);
              const isTodayDate = dayStart.getTime() === today.getTime();

              const isInMonth = day.getMonth() + 1 === month;

              // 기존 비활성화 로직
              const isBeforeSignupDay = dayStart.getTime() < signup.getTime();
              const isFutureDay = dayStart.getTime() > today.getTime();
              const isDisabled = !isInMonth || isBeforeSignupDay || isFutureDay;

              // 로딩 상태 (해당 월의 활성화된 날짜만 해당)
              const isLoading =
                emotions.length === 0 &&
                isInMonth &&
                !isBeforeSignupDay &&
                !isFutureDay;

              // 감정 데이터 추출
              const emotionID =
                !isDisabled && !isLoading
                  ? (emotions[dayNumber - 1] ?? null)
                  : null;
              const EmotionIcon = getEmotionIcon(emotionID);
              const iconBgColorClass = getEmotionBgColor(emotionID);

              // Figma 'data-type'에 맞게 상태 정의
              let dataType: 'disabled' | 'not yet' | 'Default' = 'Default';
              if (isDisabled) {
                dataType = 'disabled';
              } else if (!EmotionIcon && !isLoading) {
                dataType = 'not yet';
              }

              return (
                <div
                  key={day.toString()}
                  // Figma 셀 기본 스타일
                  className={cn(
                    'flex-1 h-28 p-2 relative flex justify-center items-center gap-2.5 overflow-hidden',
                    // 마지막 셀을 제외하고 오른쪽 테두리 적용
                    dayIndex < 6 && 'border-r border-grayscale-gray20',
                    // Figma 'data-hover' (활성화된 날짜만)
                    !isDisabled && 'hover:bg-grayscale-gray5 cursor-pointer',
                    'bg-white', // 기본 배경
                  )}
                  data-type={dataType}
                  data-today={isTodayDate}
                  data-size="L"
                >
                  {/* 감정 아이콘 (data-type="Default") */}
                  {dataType === 'Default' && EmotionIcon && (
                    <div
                      data-type="emotion-icon-wrapper"
                      className={cn(
                        'w-14 h-14 relative rounded-[60px] overflow-hidden flex items-center justify-center',
                        iconBgColorClass, // 'constants/emotions.ts'에서 정의된 배경색
                      )}
                    >
                      {/* Figma의 복잡한 div 아이콘 대신 
                        'constants/emotions'의 React 아이콘 컴포넌트 사용 
                      */}
                      <EmotionIcon className="w-14 h-14" />
                    </div>
                  )}

                  {/* 로딩 스켈레톤 (UX 개선) */}
                  {isLoading && (
                    <div className="w-14 h-14 rounded-[60px] bg-grayscale-gray10 animate-pulse" />
                  )}

                  {/* 날짜 숫자 (항상 표시) */}
                  <div
                    className={cn(
                      'w-7 h-7 p-2.5 left-[8px] top-[8px] absolute rounded-[999px]',
                      'inline-flex flex-col justify-center items-center gap-2.5',
                      // Figma 'data-today="true"' 스타일
                      isTodayDate && 'bg-grayscale-gray80',
                    )}
                  >
                    <div className="pt-0.5 flex flex-col justify-center items-center gap-2.5">
                      <Text
                        variant="body05"
                        className={cn(
                          isTodayDate
                            ? 'text-white'
                            : isDisabled
                              ? 'text-grayscale-gray40'
                              : 'text-grayscale-gray90',
                        )}
                      >
                        {dayNumber}
                      </Text>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </ParentLayout>
  );
}
