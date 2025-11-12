/*
 * 파일 경로: src/app/parent/[childId]/calendar/_components/Calendar.tsx
 * (이 코드로 덮어쓰세요)
 */
'use client';

import { useEffect, useState, useRef } from 'react';
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
  startOfDay,
} from 'date-fns';
import { cn } from '@/lib/utils';
import { Text } from '@/ui/Text';
import { Button } from '@/ui/Button';
import ParentLayout from '../../_components/Layout/ParentLayout';
// [MODIFIED] AnalysisList 대신 QuestionCard와 관련 타입을 직접 임포트
import QuestionCard from '../../_components/Question/QuestionCard';
import {DateSubject,Question}   from '@/types'; 
import  Skeleton from '@/ui/loading/Skeleton';
import EmptyPlaceHolder from '@/ui/loading/EmptyPlaceHolder';
import { useSubjectStore } from '@/store/useSubjectStore';
import { dateSubjectCache } from '@/lib/cache/DateSubjectCache'; // [NEW] 요청하신 날짜 캐시 임포트

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일'];

interface CalendarProps {
  childId: string;
  defaultemotions: string[];
  mostEmotion: number[];
  signupDate: string;
}

type EmotionIconComponent = React.FC<
  React.SVGProps<SVGSVGElement> & { className?: string }
>;

// API 응답 타입 (SubjectType이 questions: Question[]을 포함한다고 가정)
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const setSubjectsInStore = useSubjectStore((state) => state.setSubjects);
  const [dateSubjects, setDateSubjects] = useState<DateSubject[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // [NEW] 비디오 재생 로직
  const [playingMap, setPlayingMap] = useState<{ [key: number]: boolean }>({});
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

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
      setSelectedDate(null);
      setDateSubjects([]);
      setSubjectsInStore([]);
      setFetchError(null);

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
      prevYearMonthRef.current = { year, month };
    }
  }, [year, month, childId, setSubjectsInStore]);

  // [MODIFIED] 날짜 클릭 핸들러 (캐시 적용)
  const handleDateClick = async (day: Date) => {
    setSelectedDate(day);
    setIsLoadingSubjects(true);
    setFetchError(null);
    setDateSubjects([]);
    setSubjectsInStore([]);

    // 1. [NEW] 캐시 키 생성 (dateSubjectCache 사용)
    const cacheKey = dateSubjectCache.createKey(childId, day);

    // 2. [NEW] 캐시 확인 (dateSubjectCache 사용)
    const cachedSubjects = dateSubjectCache.get(cacheKey);
    if (cachedSubjects) {
      console.log('날짜 캐시 사용:', cacheKey);
      setDateSubjects(cachedSubjects as DateSubject[]); // 타입 단언
      setSubjectsInStore(cachedSubjects as DateSubject[]);
      setIsLoadingSubjects(false);
      return; // 캐시된 데이터 사용, API 호출 스킵
    }

    // 3. [NEW] 캐시가 없으면 API 호출
    console.log('API 호출 (날짜):', cacheKey);
    try {
      const res = await Fetcher<SubjectsByDateData>(
        `/parent/${childId}/subjects?date=${format(day, 'yyyy-MM-dd')}`,
      );

      if (res.isSuccess && res.data) {
        const fetchedSubjects = res.data.subjects;
        setDateSubjects(fetchedSubjects);
        setSubjectsInStore(fetchedSubjects);

        // 4. [NEW] API 응답을 캐시에 저장 (dateSubjectCache 사용)
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

  // [NEW] 비디오 재생 핸들러
  const handlePlayClick = (questionId: number) => {
    setPlayingMap((prev) => ({ ...prev, [questionId]: true }));
    setTimeout(() => {
      videoRefs.current[questionId]?.play();
    }, 0);
  };

  const handleVideoEnd = (questionId: number) => {
    setPlayingMap((prev) => ({ ...prev, [questionId]: false }));
  };

  // 캘린더 날짜 배열 생성
  const startDate = startOfWeek(startMonth, { weekStartsOn: 1 });
  const endDate = endOfWeek(endMonth, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

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

  return (
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
            <Text variant={'title01'}>가장 많이 선택한 감정은</Text>
          </div>
          <div className="w-14 h-14 ml-2.5 mt-1.5 mb-6 relative rounded-[60px] overflow-hidden flex items-center justify-center bg-other-yellow-light">
            {MostEmotionIcon ? <MostEmotionIcon className="w-10 h-10" /> : null}
          </div>
        </div>
      }
    >
      {/* 캘린더와 분석 리스트를 가로로 배치 */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* === 캘린더 섹션 (Left) === */}
        <div className="flex-1 max-w-full">
          {/* 요일 헤더 */}
          <div className="self-stretch h-12 bg-Grayscale-gray5 border-b border-Grayscale-gray20 inline-flex justify-start items-center">
            {WEEKDAYS.map((d, index) => (
              <div
                key={d}
                className={cn(
                  'flex-1 self-stretch p-2 flex justify-center items-center gap-2.5 overflow-hidden',
                  index < WEEKDAYS.length - 1 &&
                    'border-r border-Grayscale-gray20',
                )}
              >
                <Text className="text-grayscale-gray90 text-base font-['NPS_font'] leading-6">
                  {d}
                </Text>
              </div>
            ))}
          </div>

          {/* 캘린더 바디 */}
          <div className="self-stretch flex-col justify-start items-start flex w-full">
            {weeks.map((week, weekIndex) => (
              <div
                key={weekIndex}
                className={cn(
                  'self-stretch inline-flex justify-start items-center overflow-hidden',
                  weekIndex < weeks.length - 1 &&
                    'border-b border-grayscale-gray20',
                )}
              >
                {week.map((day, dayIndex) => {
                  const dayNumber = day.getDate();
                  const dayStart = startOfDay(day);
                  const isTodayDate = dayStart.getTime() === today.getTime();
                  const isInMonth = day.getMonth() + 1 === month;
                  const isBeforeSignupDay =
                    dayStart.getTime() < signup.getTime();
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
                      ? emotions[dayNumber - 1] ?? null
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
                      key={day.toString()}
                      onClick={() => !isDisabled && handleDateClick(day)}
                      className={cn(
                        'flex-1 h-28 p-2 relative flex justify-center items-center gap-2.5 overflow-hidden',
                        dayIndex < 6 && 'border-r border-grayscale-gray20',
                        !isDisabled && 'hover:bg-grayscale-gray5 cursor-pointer',
                        isSelected && !isDisabled
                          ? 'bg-Primary-light ring-2 ring-Primary-purple ring-inset'
                          : 'bg-white',
                      )}
                      data-type={dataType}
                      data-today={isTodayDate}
                      data-size="L"
                    >
                      {dataType === 'Default' && EmotionIcon && (
                        <div
                          data-type="emotion-icon-wrapper"
                          className={cn(
                            'w-14 h-14 relative rounded-[60px] overflow-hidden flex items-center justify-center',
                          )}
                        >
                          <EmotionIcon className="w-14 h-14" />
                        </div>
                      )}
                      {isLoading && (
                        <div className="w-14 h-14 rounded-[60px] bg-grayscale-gray10 animate-pulse" />
                      )}
                      <div
                        className={cn(
                          'w-7 h-7 p-2.5 left-[8px] top-[8px] absolute rounded-[999px]',
                          'inline-flex flex-col justify-center items-center gap-2.5',
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
        </div>

        {/* === [MODIFIED] 분석 리스트 섹션 (Right) === */}
        <div className="w-fullflex-shrink-0">
          <div className="mb-4">
            <Text variant="title02" className="text-grayscale-gray80">
              {selectedDate
                ? `${format(selectedDate, 'M월 d일')}의 대화`
                : '날짜를 선택해 주세요'}
            </Text>
          </div>

          {isLoadingSubjects ? (
            <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
              <Skeleton className="h-8 w-3/4 rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          ) : fetchError ? (
            <EmptyPlaceHolder> {fetchError} </EmptyPlaceHolder>
          ) : dateSubjects.length > 0 ? (
            // [NEW] QuestionCard를 직접 렌더링
            <div className="flex-1 overflow-y-auto w-full space-y-4">
              {dateSubjects.map((subject, index) => (
                // 주제별로 섹션을 나눔
                <div
                  key={`subject-${subject}-${index}`}
                  className="p-4 bg-white rounded-lg shadow-sm"
                >
                  <Text variant="title04" className="mb-3">
                    {subject.subjectTitle}
                  </Text>
                  {/* API 응답의 questions 배열을 순회 */}
                  {subject.questions && subject.questions.length > 0 ? (
                    subject.questions.map((q: Question) => (
                      <QuestionCard
                        key={q.questionId}
                        question={q}
                        isPlaying={!!playingMap[q.questionId]}
                        onPlayClick={() => handlePlayClick(q.questionId)}
                        onVideoEnd={() => handleVideoEnd(q.questionId)}
                        videoRef={(el) => {
                          videoRefs.current[q.questionId] = el;
                        }}
                      />
                    ))
                  ) : (
                    <Text variant="body03" className="text-grayscale-gray60">
                      질문이 없습니다.
                    </Text>
                  )}
                </div>
              ))}
            </div>
          ) : selectedDate ? (
            <EmptyPlaceHolder > 해당 날짜에 완료된 대화가 없습니다.</EmptyPlaceHolder>
          ) : (
            <EmptyPlaceHolder> 캘린더에서 날짜를 선택하면 대화 기록이 표시됩니다. </EmptyPlaceHolder>
          )}
        </div>
      </div>
    </ParentLayout>
  );
}