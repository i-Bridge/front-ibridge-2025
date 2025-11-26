'use client';

import { useState, useRef, useEffect } from 'react';
import { DateSubject, Question } from '@/types';
import { Text } from '@/ui/Text';
import { XIcon } from '@/ui/icon/icon';
import QuestionCard from '../../_components/Question/QuestionCard';
import CarouselStepper from '@/components/CarouselStepper';
import RotatingSpinner from '@/ui/loading/RotatingSpinner';
import EmptyPlaceHolder from '@/ui/loading/EmptyPlaceHolder';
import { formatDateWithDay } from '@/hooks/formatDateWithDay';
import { cn } from '@/lib/utils';

interface DayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  subjects: DateSubject[];
  isLoading: boolean;
  error: string | null;
}

export default function DayDetailModal({
  isOpen,
  onClose,
  selectedDate,
  subjects,
  isLoading,
  error,
}: DayDetailModalProps) {
  // 캐러셀 현재 단계 (1-based)
  const [currentStep, setCurrentStep] = useState(1);

  // 비디오 재생 로직 상태
  const [playingMap, setPlayingMap] = useState<{ [key: number]: boolean }>({});
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  // 모달이 열리거나 데이터가 변경될 때 초기화
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setPlayingMap({});
    }
  }, [isOpen, subjects]);

  // 닫기 핸들러: 비디오 정지 후 부모 onClose 호출
  const handleModalClose = () => {
    pauseAllVideos();
    setPlayingMap({});
    onClose();
  };

  // 모든 비디오 일시정지 헬퍼 함수
  const pauseAllVideos = (exceptId?: number) => {
    Object.keys(videoRefs.current).forEach((k) => {
      const id = Number(k);
      if (exceptId !== undefined && id === exceptId) return;

      const video = videoRefs.current[id];
      if (video && !video.paused) {
        try {
          video.pause();
        } catch (e) {
          console.error(e);
        }
      }
    });
  };

  // 비디오 재생 클릭 핸들러
  const handlePlayClick = (questionId: number) => {
    pauseAllVideos(questionId);

    const target = videoRefs.current[questionId];
    if (target) {
      try {
        setPlayingMap((prev) => {
          const newState: { [key: number]: boolean } = {};
          Object.keys(prev).forEach((k) => (newState[Number(k)] = false));
          newState[questionId] = true;
          return newState;
        });
        void target.play();
      } catch (e) {
        console.error('Video play error:', e);
      }
    } else {
      setPlayingMap({ [questionId]: true });
    }
  };

  const handleVideoEnd = (questionId: number) => {
    setPlayingMap((prev) => ({ ...prev, [questionId]: false }));
    const v = videoRefs.current[questionId];
    if (v && !v.paused) {
      v.pause();
    }
  };

  // 캐러셀 스텝 변경 시 비디오 정지
  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    setPlayingMap({});
    pauseAllVideos();
  };

  // 현재 보여줄 Subject 계산
  const currentSubject =
    subjects && subjects.length >= currentStep
      ? subjects[currentStep - 1]
      : undefined;

  // 렌더링되지 않아야 할 때 (애니메이션을 위해 DOM은 유지하되 포인터 이벤트 및 시각적 요소 제어)
  // lg 화면에서는 캘린더 옆에 붙어있는 형태이므로 isOpen이 false라도 애니메이션 처리를 위해 렌더링될 수 있음
  const isVisible = isOpen || document.getElementById('modal-panel');
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex justify-center md:justify-end',
        // isOpen일 때만 포인터 이벤트 활성화 (단, lg에서는 백드롭이 없으므로 모달 영역 외 클릭 허용을 위해 설정 조정 필요)
        isOpen ? 'pointer-events-auto' : 'pointer-events-none',
        // lg 화면에서는 fixed 컨테이너가 전체를 가리지 않도록(캘린더 클릭 가능하게) 설정
        'lg:pointer-events-none'
      )}
    >
      {/* Backdrop (배경 오버레이) */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-300',
          // Mobile & Tablet: 어두운 배경 (bg-black/60)
          'bg-black/60',
          // Desktop (lg): 배경 투명 (피그마 코드 반영 - 오버레이 없음), 클릭 통과시킴
          'lg:bg-transparent lg:hidden',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
        onClick={handleModalClose}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div
        id="modal-panel"
        className={cn(
          'absolute bg-white overflow-hidden flex flex-col transition-transform duration-300 ease-in-out pointer-events-auto',
          
          // --- Mobile (Default) ---
          // Bottom Sheet 스타일
          'bottom-0 left-0 right-0 w-full h-[85vh] rounded-t-[20px] shadow-xl',
          isOpen ? 'translate-y-0' : 'translate-y-full',

          // --- Tablet (md) ---
          // Side Panel 스타일 (오버레이 있음, 그림자 있음)
          'md:top-0 md:right-0 md:bottom-auto md:left-auto md:h-full md:rounded-none md:translate-y-0',
          'md:w-[600px] md:shadow-xl',
          isOpen ? 'md:translate-x-0' : 'md:translate-x-full',

          // --- Desktop (lg) ---
          // In-Page Sidebar 스타일 (오버레이 없음, 경계선(border-l) 있음, 그림자 제거)
          // 피그마 코드의 'border-l border-Grayscale-gray20' 반영
          'lg:w-[600px] lg:border-l lg:border-grayscale-gray20 lg:shadow-none',
          // lg에서는 슬라이드 효과 없이 바로 보이거나, 필요하다면 슬라이드 유지 (여기선 통일성을 위해 슬라이드 유지)
          isOpen ? 'lg:translate-x-0' : 'lg:translate-x-full'
        )}
      >
        {/* Mobile Handle (md 이상에서는 숨김) */}
        <div className="md:hidden w-full h-6 relative bg-white flex justify-center items-center shrink-0">
          <div className="w-20 h-1 bg-grayscale-gray20 rounded-[100px]" />
        </div>

        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Header Area */}
          {/* 피그마: self-stretch px-10 pt-10 pb-5 ... */}
          <div className="px-5 pt-5 pb-5 md:px-10 md:pt-10 md:pb-5 flex flex-col justify-start items-start gap-3 shrink-0">
            <div className="w-full flex justify-between items-center gap-2">
              <div className="flex justify-start items-center gap-2">
                <Text
                  variant="body02"
                  className="text-grayscale-gray60 font-extrabold"
                >
                  {selectedDate ? formatDateWithDay(selectedDate) : ''}
                </Text>

                {subjects.length > 1 && (
                  <div className="flex justify-start items-center gap-3">
                    <CarouselStepper
                      currentStep={currentStep}
                      totalSteps={subjects.length}
                      onStepChange={handleStepChange}
                    />
                  </div>
                )}
              </div>
              <button
                onClick={handleModalClose}
                aria-label="닫기"
                className="text-grayscale-gray60 hover:text-grayscale-gray80 transition p-1"
              >
                <XIcon/>
              </button>
            </div>
            {currentSubject && (
              <Text
                variant="title04"
                className="text-grayscale-gray90 font-extrabold line-clamp-2"
              >
                {currentSubject.subjectTitle}
              </Text>
            )}
          </div>

          {/* Body Area (Scrollable) */}
          {/* 피그마: self-stretch h-[1003px] px-10 pt-5 pb-10 ... */}
          <div className="flex-1 overflow-y-auto px-5 pt-2 pb-10 md:px-10 md:pt-5 md:pb-10 flex flex-col gap-5">
            {isLoading ? (
              <div className="flex-1 flex justify-center items-center min-h-[300px]">
                <RotatingSpinner variant="grayscale" />
              </div>
            ) : error ? (
              <EmptyPlaceHolder>{error}</EmptyPlaceHolder>
            ) : subjects.length > 0 ? (
              <>
                {currentSubject &&
                currentSubject.questions &&
                currentSubject.questions.length > 0 ? (
                  currentSubject.questions.map((q: Question, index) => (
                    <QuestionCard
                      key={`q-${q.questionId}-${index}`}
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
                  <div className="flex justify-center items-center py-10">
                    <Text variant="body03" className="text-grayscale-gray60">
                      질문이 없습니다.
                    </Text>
                  </div>
                )}
              </>
            ) : (
              <EmptyPlaceHolder>
                해당 날짜에 완료된 대화가 없습니다.
              </EmptyPlaceHolder>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}