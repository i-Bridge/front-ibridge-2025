'use client';

import { useEffect, useState, useRef } from 'react';
import { EmotionId, EMOTIONS } from '@/constants/emotions';
import { StatEmotionResponse } from '@/types';
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
import QuestionCard from '../../_components/Question/QuestionCard';
import { DateSubject, Question } from '@/types';
import Skeleton from '@/ui/loading/Skeleton';
import EmptyPlaceHolder from '@/ui/loading/EmptyPlaceHolder';
import { useSubjectStore } from '@/store/useSubjectStore';
import { dateSubjectCache } from '@/lib/cache/DateSubjectCache';
import TitleComponent from '@/ui/Modal/TitleComponent';
import PopupOverlay from '@/ui/Modal/PopupOverlay';
import { XIcon } from '@/ui/icon/icon';
import CarouselStepper from '@/components/CarouselStepper';

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
  const [mostEmotionState, setMostEmotionState] =
    useState<EmotionId>(mostEmotion);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const setSubjectsInStore = useSubjectStore((state) => state.setSubjects);
  const [dateSubjects, setDateSubjects] = useState<DateSubject[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // 비디오 재생 로직
  // playingMap: questionId -> boolean
  const [playingMap, setPlayingMap] = useState<{ [key: number]: boolean }>({});
  // refs for actual <video> elements
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

  // 팝업 상태
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // 캐러셀 현재 단계 (1-based)
  const [currentStep, setCurrentStep] = useState(1);

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

  // 날짜 클릭 핸들러 (캐시 적용) + 팝업 열기
  const handleDateClick = async (day: Date) => {
    setSelectedDate(day);
    setIsPopupOpen(true);
    setIsLoadingSubjects(true);
    setFetchError(null);
    setDateSubjects([]);
    setSubjectsInStore([]);
    setCurrentStep(1); // 캐러셀 리셋
    setPlayingMap({}); // 재생 상태 초기화

    // 캐시 키 생성
    const cacheKey = dateSubjectCache.createKey(childId, day);

    // 캐시 확인
    const cachedSubjects = dateSubjectCache.get(cacheKey);
    if (cachedSubjects) {
      console.log('날짜 캐시 사용:', cacheKey);
      const cs = cachedSubjects as DateSubject[];
      setDateSubjects(cs);
      setSubjectsInStore(cs);
      setIsLoadingSubjects(false);
      return; // 캐시된 데이터 사용, API 호출 스킵
    }

    // 캐시가 없으면 API 호출
    console.log('API 호출 (날짜):', cacheKey);
    try {
      const res = await Fetcher<SubjectsByDateData>(
        `/parent/${childId}/subjects?date=${format(day, 'yyyy-MM-dd')}`,
      );

      if (res.isSuccess && res.data) {
        const fetchedSubjects = res.data.subjects;
        setDateSubjects(fetchedSubjects);
        setSubjectsInStore(fetchedSubjects);

        // 캐시에 저장
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

  // 팝업 닫기: 모든 비디오 중지 + 상태 초기화
  const handleClose = () => {
    // pause all videos
    try {
      Object.keys(videoRefs.current).forEach((k) => {
        const id = Number(k);
        const v = videoRefs.current[id];
        if (v && !v.paused) {
          v.pause();
          // optionally reset currentTime: v.currentTime = 0;
        }
      });
    } catch (e) {
      // ignore
      console.log(e);
    }
    setPlayingMap({});
    setIsPopupOpen(false);
    setSelectedDate(null);
    setDateSubjects([]);
    setCurrentStep(1);
  };

  // 비디오 재생: 해당 questionId만 재생, 다른 비디오들은 멈춤
  const handlePlayClick = (questionId: number) => {
    // Pause every other video first
    Object.keys(videoRefs.current).forEach((k) => {
      const id = Number(k);
      const video = videoRefs.current[id];
      if (!video) return;
      if (id === questionId) return;
      try {
        if (!video.paused) {
          video.pause();
        }
      } catch (e) {
        // ignore
        console.log(e);
      }
    });

    // Play target video (if exists)
    const target = videoRefs.current[questionId];
    if (target) {
      try {
        // Ensure other playingMap entries are false, only this true
        const newPlaying: { [key: number]: boolean } = {};
        Object.keys(videoRefs.current).forEach((k) => {
          const id = Number(k);
          newPlaying[id] = id === questionId;
        });
        // also include questions that may not have refs yet (set true only for target)
        newPlaying[questionId] = true;

        setPlayingMap(newPlaying);

        // play (some browsers require user gesture; this is called from click)
        void target.play();
      } catch (e) {
        console.error('video play error', e);
      }
    } else {
      // mark playing state for the id so UI reflects it (if video element not mounted yet)
      setPlayingMap({ [questionId]: true });
    }
  };

  const handleVideoEnd = (questionId: number) => {
    // mark ended
    setPlayingMap((prev) => ({ ...prev, [questionId]: false }));
    // ensure videoRef is paused/stopped
    const v = videoRefs.current[questionId];
    if (v && !v.paused) {
      try {
        v.pause();
      } catch (e) {
        // ignore
        console.log(e);
      }
    }
  };

  // calendar generation
  const startDate = startOfWeek(startMonth, { weekStartsOn: 1 });
  const endDate = endOfWeek(endMonth, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const weeks: Date[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  // month navigation
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
    if (emotion && typeof emotion.icon === 'function') {
      return emotion.icon;
    }
    return null;
  };

  const MostEmotionIcon = getEmotionIcon(mostEmotionState);

  // reset currentStep when dateSubjects change (new data)
  useEffect(() => {
    setCurrentStep(1);
  }, [dateSubjects]);

  // derive current subject from currentStep (1-based)
  const currentSubject =
    dateSubjects && dateSubjects.length >= currentStep
      ? dateSubjects[currentStep - 1]
      : undefined;

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
            <TitleComponent title="가장 많이 선택한 감정은" align="start" />
          </div>
          <div className="w-14 h-14 ml-2.5 mt-1.5 mb-6 relative rounded-[60px] overflow-hidden flex items-center justify-center bg-other-yellow-light">
            {MostEmotionIcon ? <MostEmotionIcon className="w-14 h-14" /> : null}
          </div>
        </div>
      }
    >
      {/* 캘린더 UI */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        <div className="flex-1 max-w-full">
          {/* 요일 헤더 (grid으로 정렬) */}
          <div className="grid grid-cols-7 w-full border-b border-grayscale-gray20">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="h-12 flex justify-center items-center border-r border-grayscale-gray20 last:border-r-0 bg-grayscale-gray5"
              >
                <Text className="text-grayscale-gray90 text-base font-['NPS_font'] leading-6">
                  {d}
                </Text>
              </div>
            ))}
          </div>

          {/* 날짜 바디 */}
          <div className="grid grid-cols-7 w-full border-l border-t border-grayscale-gray20">
            {calendarDays.map((day) => {
              const dayNumber = day.getDate();
              const dayStart = startOfDay(day);
              const isTodayDate = dayStart.getTime() === today.getTime();
              const isInMonth = day.getMonth() + 1 === month;
              const isBeforeSignupDay = dayStart.getTime() < signup.getTime();
              const isFutureDay = dayStart.getTime() > today.getTime();
              const isDisabled = !isInMonth || isBeforeSignupDay || isFutureDay;
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
                    'h-28 flex flex-col justify-center items-center relative border-r border-b border-grayscale-gray20 last:border-r-0 bg-white',
                    !isDisabled && 'hover:bg-grayscale-gray5 cursor-pointer',
                    isSelected &&
                      'bg-primary-light ring-2 ring-primary-purple ring-inset',
                  )}
                  data-type={dataType}
                  data-today={isTodayDate}
                >
                  {dataType === 'Default' && EmotionIcon && (
                    <div className="lg:w-14 lg:h-14 w-9 h-9 rounded-full flex items-center justify-center">
                      <EmotionIcon className="w-14 h-14" />
                    </div>
                  )}
                  {isLoading && (
                    <div className="w-14 h-14 rounded-full bg-grayscale-gray10 animate-pulse" />
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

        {/* 분석 리스트는 팝업으로 대체 (우측 공간 숨김) */}
        <div className="w-full flex-shrink-0 hidden" />
      </div>

      {/* 팝업: 날짜 클릭 시 표시 */}
      {isPopupOpen && (
        <PopupOverlay onClose={handleClose}>
          <div className="px-10">
            <div className="bg-white flex flex-col  justify-start items-start rounded-[40px] relative gap-10 lg:max-w-7xl w-full max-h-[90vh] overflow-hidden">
              {/* X 버튼 (오른쪽 상단) */}
              <button
                onClick={handleClose}
                aria-label="닫기"
                className="absolute right-6 top-6 text-grayscale-gray60 hover:text-grayscale-gray80 transition"
              >
                <XIcon />
              </button>

              <div className="w-full p-10 overflow-y-auto max-h-[90vh]">
                {/* 타이틀 + 캐러셀 스텝퍼 */}
                <div className="flex justify-between items-center flex-col lg:flex-row mb-6">
                  <Text variant="title02" className="text-grayscale-gray80">
                    {selectedDate
                      ? `${format(selectedDate, 'M월 d일')}의 대화`
                      : ''}
                  </Text>


                  {/* 캐러셀 스텝퍼: subject가 2개 이상일 때만 보여줌 */}
                  {dateSubjects.length > 1 && (
                    <CarouselStepper
                      currentStep={currentStep}
                      totalSteps={dateSubjects.length}
                      onStepChange={(step) => {
                        // step은 1-based
                        setCurrentStep(step);
                        // reset playingMap when switching subject
                        setPlayingMap({});
                        // pause existing video refs
                        Object.values(videoRefs.current).forEach((v) => {
                          try {
                            v?.pause();
                          } catch (e) {
                            console.log(e);
                          }
                        });
                      }}
                    />
                  )}
                </div>

                {/* content */}
                {isLoadingSubjects ? (
                  <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
                    <Skeleton className="h-8 w-3/4 rounded-lg" />
                    <Skeleton className="h-16 w-full rounded-lg" />
                    <Skeleton className="h-16 w-full rounded-lg" />
                  </div>
                ) : fetchError ? (
                  <EmptyPlaceHolder> {fetchError} </EmptyPlaceHolder>
                ) : dateSubjects.length > 0 ? (
                  <>
                    {/* 현재 단계의 subject만 렌더링 (currentStep은 1-based) */}
                    {currentSubject ? (
                      <div
                        key={`subject-${currentSubject.subjectId}`} // <- 숫자 대신 고유 문자열 키 사용
                        className="p-4 bg-white rounded-lg shadow-sm flex flex-col gap-3"
                      >
                        

                        {currentSubject.questions &&
                        currentSubject.questions.length > 0 ? (
                          currentSubject.questions.map((q: Question,index) => (
                            <QuestionCard
                              key={`q-${q.questionId}-${index}`} // <- 질문 key도 문자열 접두사 추가
                              question={q}
                              isPlaying={!!playingMap[q.questionId]}
                              onPlayClick={() => handlePlayClick(q.questionId)}
                              onVideoEnd={() => handleVideoEnd(q.questionId)}
                              videoRef={(el: HTMLVideoElement | null) => {
                                if (el) {
                                  videoRefs.current[q.questionId] = el;
                                } else {
                                  delete videoRefs.current[q.questionId];
                                }
                              }}
                            />
                          ))
                        ) : (
                          <Text
                            variant="body03"
                            className="text-grayscale-gray60"
                          >
                            질문이 없습니다.
                          </Text>
                        )}
                      </div>
                    ) : null}
                  </>
                ) : (
                  <EmptyPlaceHolder>
                    해당 날짜에 완료된 대화가 없습니다.
                  </EmptyPlaceHolder>
                )}
              </div>
            </div>
          </div>
        </PopupOverlay>
      )}
    </ParentLayout>
  );
}
