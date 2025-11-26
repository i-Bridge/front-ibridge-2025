'use client';

import { useEffect, useState, useRef } from 'react';
import { EmotionId, EMOTIONS } from '@/constants/emotions';
import { StatEmotionResponse, DateSubject } from '@/types';
import { Fetcher } from '@/lib/api/fetcher';
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
import { cn } from '@/lib/utils';
import { Text } from '@/ui/Text';
import { Button } from '@/ui/Button';
import ParentLayout from '../../_components/Layout/ParentLayout';
import { useSubjectStore } from '@/store/useSubjectStore';
import { dateSubjectCache } from '@/lib/cache/DateSubjectCache';
import TitleComponent from '@/ui/Modal/TitleComponent';
import DayDetailModal from './DayDetailModal';

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일'];

interface CalendarProps {
  childId: string;
  defaultemotions: number[];
  mostEmotion: number;
  signupDate: string;
}

type EmotionIconComponent = React.FC<
  React.SVGProps<SVGSVGElement> & { className?: string }
>;

type SubjectsByDateData = {
  subjectCount: number;
  subjects: DateSubject[];
};

export default function Calendar({
  childId,
  defaultemotions,
  mostEmotion,
  signupDate,
}: CalendarProps) {
  const today = startOfDay(new Date());
  const signup = startOfDay(new Date(signupDate));

  const [currentDate, setCurrentDate] = useState(today);
  const [emotions, setEmotions] = useState<EmotionId[]>(
    defaultemotions.map((e) => Number(e)),
  );
  const [mostEmotionState, setMostEmotionState] =
    useState<EmotionId>(mostEmotion);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const setSubjectsInStore = useSubjectStore((state) => state.setSubjects);

  // 데이터 상태
  const [dateSubjects, setDateSubjects] = useState<DateSubject[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // 팝업 상태
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const prevYearMonthRef = useRef({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const startMonth = startOfMonth(currentDate);
  const endMonth = endOfMonth(currentDate);
  const signupMonthStart = startOfMonth(signup);
  const currentMonthStart = startOfMonth(today);
  const isCurrentMonth = startMonth.getTime() === currentMonthStart.getTime();
  const isSignupMonth = startMonth.getTime() === signupMonthStart.getTime();

  // 감정 데이터 불러오기 (연/월 변경 시)
  useEffect(() => {
    const prev = prevYearMonthRef.current;
    if (year !== prev.year || month !== prev.month) {
      setEmotions([]);
      setMostEmotionState(0);
      setSelectedDate(null);
      setDateSubjects([]);
      setSubjectsInStore([]);
      setFetchError(null);

      async function fetchEmotions() {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-01`;
        try {
          const res = await Fetcher<StatEmotionResponse>(
            `/parent/${childId}/stat/emotion?date=${dateStr}`,
          );
          if (res.isSuccess && res.data?.emotions) {
            setEmotions(res.data.emotions.map((e) => Number(e)));
            setMostEmotionState(res.data.emotion);
          } else {
            setEmotions([]);
            setMostEmotionState(0);
          }
        } catch (err) {
          console.error(err);
          setEmotions([]);
          setMostEmotionState(0);
        }
      }

      fetchEmotions();
      prevYearMonthRef.current = { year, month };
    }
  }, [year, month, childId, setSubjectsInStore]);

  // 날짜 클릭 핸들러
  const handleDateClick = async (day: Date) => {
    setSelectedDate(day);
    setIsPopupOpen(true);
    setIsLoadingSubjects(true);
    setFetchError(null);
    setDateSubjects([]);
    setSubjectsInStore([]);

    const cacheKey = dateSubjectCache.createKey(childId, day);
    const cachedSubjects = dateSubjectCache.get(cacheKey);

    if (cachedSubjects) {
      const cs = cachedSubjects as DateSubject[];
      console.log('날짜 캐시 사용:', cacheKey);
      setDateSubjects(cs);
      setSubjectsInStore(cs);
      setIsLoadingSubjects(false);
      return;
    }

    console.log('API 호출 (날짜):', cacheKey);
    try {
      const res = await Fetcher<SubjectsByDateData>(
        `/parent/${childId}/subjects?date=${format(day, 'yyyy-MM-dd')}`,
      );

      if (res.isSuccess && res.data) {
        const fetchedSubjects = res.data.subjects;
        setDateSubjects(fetchedSubjects);
        setSubjectsInStore(fetchedSubjects);
        dateSubjectCache.set(cacheKey, fetchedSubjects);
      } else {
        setDateSubjects([]);
        setSubjectsInStore([]);
        setFetchError(res.message || '데이터를 불러오지 못했습니다.');
      }
    } catch (err) {
      console.error(err);
      setDateSubjects([]);
      setSubjectsInStore([]);
      setFetchError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoadingSubjects(false);
    }
  };

  const handleClose = () => {
    setIsPopupOpen(false);
    setSelectedDate(null);
    setDateSubjects([]);
  };

  const calendarGeneration = () => {
    const startDate = startOfWeek(startMonth, { weekStartsOn: 1 });
    const endDate = endOfWeek(endMonth, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    return days;
  };
  const calendarDays = calendarGeneration();

  const prevMonth = () => {
    if (!isSignupMonth) setCurrentDate(subMonths(currentDate, 1));
  };
  const nextMonth = () => {
    if (!isCurrentMonth) setCurrentDate(addMonths(currentDate, 1));
  };

  const getEmotionIcon = (
    emotionId: EmotionId | null,
  ): EmotionIconComponent | null => {
    if (emotionId === null) return null;
    const emotion = EMOTIONS.find((e) => e.id === emotionId);
    return emotion?.icon || null;
  };

  const MostEmotionIcon = getEmotionIcon(mostEmotionState);

  // 아이콘 크기 스타일 정의 (재사용을 위해 변수화)
  // 기본: 모바일 9(36px), md 이상 14(56px)
  // 팝업 오픈 시(lg): 9(36px)로 강제 축소
  const iconSizeClass = cn(
    'transition-all duration-300', // 크기 변화 애니메이션
    'w-9 h-9 md:w-14 md:h-14', // 기본 반응형 크기
    isPopupOpen && 'lg:w-9 lg:h-9', // lg 화면에서 팝업 열리면 w-9 h-9로 축소
  );

  return (
    <ParentLayout
      title={
        <div className="w-full h-full self-stretch justify-between flex gap-5">
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
                variant="grayscale"
                className="w-8 h-8 p-1.5 bg-grayscale-gray10 rounded-[999px] inline-flex justify-center items-center"
              >
                {'<'}
              </Button>
              <Button
                onClick={nextMonth}
                disabled={isCurrentMonth}
                variant="grayscale"
                className="w-8 h-8 p-1.5 bg-grayscale-gray10 rounded-[999px] inline-flex justify-center items-center"
              >
                {'>'}
              </Button>
            </div>
            <TitleComponent title="가장 많이 선택한 감정은" align="start" />
          </div>
          <div className="h-auto self-stretch flex flex-col justify-center items-center">
            <div className="md:w-24 md:h-24 w-16 h-16 rounded-full flex items-center justify-center bg-other-yellow-light">
              {MostEmotionIcon ? (
                <MostEmotionIcon className="md:w-24 md:h-24 w-16 h-16" />
              ) : null}
            </div>
          </div>
        </div>
      }
    >
      <div className="flex w-full relative">
        <div
          className={cn(
            'flex flex-col lg:flex-row gap-6 w-full transition-all duration-300 ease-in-out',
            isPopupOpen && 'lg:mr-[600px]', // 모달 오픈 시 캘린더 영역 축소
          )}
        >
          <div className="flex-1 max-w-full">
            <div className="grid grid-cols-7 w-full border-b border-grayscale-gray20">
              {WEEKDAYS.map((d) => (
                <div
                  key={d}
                  className="h-12 flex justify-center items-center border-r border-grayscale-gray20 last:border-r-0 bg-grayscale-gray5"
                >
                  <Text variant="body05">{d}</Text>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 w-full border-l border-t border-grayscale-gray20">
              {calendarDays.map((day) => {
                const dayNumber = day.getDate();
                const dayStart = startOfDay(day);
                const isTodayDate = dayStart.getTime() === today.getTime();
                const isInMonth = day.getMonth() + 1 === month;
                const isBeforeSignupDay = dayStart.getTime() < signup.getTime();
                const isFutureDay = dayStart.getTime() > today.getTime();
                const isDisabled =
                  !isInMonth || isBeforeSignupDay || isFutureDay;

                const isLoading =
                  emotions.length === 0 &&
                  isInMonth &&
                  !isBeforeSignupDay &&
                  !isFutureDay;

                const emotionID =
                  !isDisabled && !isLoading
                    ? (emotions[dayNumber] ?? null)
                    : null;
                const EmotionIcon = getEmotionIcon(emotionID);

                let dataType: 'disabled' | 'not yet' | 'Default' = 'Default';
                if (isDisabled) dataType = 'disabled';
                else if (!EmotionIcon && !isLoading) dataType = 'not yet';

                const isSelected =
                  selectedDate &&
                  startOfDay(day).getTime() ===
                    startOfDay(selectedDate).getTime();

                return (
                  <div
                    key={day.toISOString()}
                    onClick={() => !isDisabled && handleDateClick(day)}
                    className={cn(
                      'h-28 flex flex-col justify-center items-center relative border-r border-b border-grayscale-gray20 last:border-r-0 bg-white transition-colors duration-200',
                      !isDisabled && 'hover:bg-grayscale-gray5 cursor-pointer',
                      isSelected &&
                        'bg-primary-light ring-2 ring-primary-purple ring-inset',
                    )}
                    data-type={dataType}
                    data-today={isTodayDate}
                  >
                    {dataType === 'Default' && EmotionIcon && (
                      <div
                        className={cn(
                          'rounded-full flex items-center justify-center',
                          iconSizeClass, // 수정된 크기 클래스 적용
                        )}
                      >
                        <EmotionIcon className={iconSizeClass} />
                      </div>
                    )}
                    {isLoading && (
                      <div
                        className={cn(
                          'rounded-full bg-grayscale-gray10 animate-pulse',
                          iconSizeClass, // 로딩 상태에도 동일한 크기 로직 적용
                        )}
                      />
                    )}
                    <div
                      className={cn(
                        'absolute left-2 top-2 w-7 h-7 flex items-center justify-center rounded-full',
                        isTodayDate ? 'bg-grayscale-gray80 text-white' : '',
                      )}
                    >
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
                );
              })}
            </div>
          </div>
        </div>

        <DayDetailModal
          isOpen={isPopupOpen}
          onClose={handleClose}
          selectedDate={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
          subjects={dateSubjects}
          isLoading={isLoadingSubjects}
          error={fetchError}
        />
      </div>
    </ParentLayout>
  );
}