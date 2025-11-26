// src/app/parent/[childId]/_components/Question/AnalysisList.tsx

'use client';

import { useState, useRef } from 'react';
import { useSubjectData } from '@/hooks/parentHome/useSubjectData';
import { useSubjectStore } from '@/store/useSubjectStore';
import { formatDateWithDay } from '@/hooks/formatDateWithDay';

import { Text } from '@/ui/Text';
import { XIcon } from '@/ui/icon/icon';
import QuestionCard from './QuestionCard';
import RotatingSpinner from '@/ui/loading/RotatingSpinner';
import EmptyPlaceHolder from '@/ui/loading/EmptyPlaceHolder';

export default function AnalysisList() {
  const { subject, questions, loading } = useSubjectData();
  const { setSelectedSubjectId, showPanels, setShowPanels } = useSubjectStore();
  
  const [playingMap, setPlayingMap] = useState<{ [key: number]: boolean }>({});
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  // 닫기 핸들러 (Desktop Panel용)
  const handleClose = () => {
    pauseAllVideos();
    setPlayingMap({});
    setSelectedSubjectId(null);
    setShowPanels(false);
  };

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

  // 패널 노출 여부 확인
  if (!showPanels) return null;

  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden">
      {/* Header Area */}
      {/* 피그마: self-stretch px-10 pt-10 pb-5 ... */}
      <div className="px-5 pt-5 pb-5 md:px-10 md:pt-10 md:pb-5 flex flex-col justify-start items-start gap-3 shrink-0 bg-white">
        <div className="w-full flex justify-between items-center gap-2">
          <div className="flex justify-start items-center gap-2">
            <Text
              variant="body02"
              className="text-grayscale-gray60 font-extrabold"
            >
              {subject ? formatDateWithDay(subject.date) : ''}
            </Text>
            
          </div>
          
          {/* LG 화면에서만 보이는 닫기 버튼 (패널 내부) */}
          <button
            onClick={handleClose}
            aria-label="닫기"
            className="lg:hidden text-grayscale-gray60 hover:text-grayscale-gray80 transition p-1"
          >
            <XIcon />
          </button>
        </div>

        {/* 제목 표시 */}
        {subject && (
          <Text
            variant="title04"
            className="text-grayscale-gray90 "
          >
            {subject.subjectTitle}
          </Text>
        )}
      </div>

      {/* Body Area (Scrollable List) */}
      {/* 피그마: self-stretch h-[1003px] px-10 pt-5 pb-10 ... */}
      <div className="flex-1 overflow-y-auto px-5 pt-2 pb-10 md:px-10 md:pt-5 md:pb-10 flex flex-col gap-5 bg-white custom-scrollbar">
        {loading ? (
          <div className="flex-1 flex justify-center items-center min-h-[300px]">
            <RotatingSpinner variant="grayscale" />
          </div>
        ) : !subject || !questions || questions.length === 0 ? (
          <div className="flex justify-center items-center py-10 h-full">
            {(!questions || questions.length === 0) && !loading ? (
               <Text variant="body03" className="text-grayscale-gray60">
                 질문이 없습니다.
               </Text>
            ) : (
              <EmptyPlaceHolder>데이터를 불러올 수 없습니다.</EmptyPlaceHolder>
            )}
          </div>
        ) : (
          // 질문 리스트 렌더링
          <>
            {questions.map((q, index) => (
              <QuestionCard
                key={`q-${q.questionId}-${index}`}
                question={q}
                isPlaying={!!playingMap[q.questionId]}
                onPlayClick={() => handlePlayClick(q.questionId)}
                onVideoEnd={() => handleVideoEnd(q.questionId)}
                videoRef={(el) => {
                  if (el) {
                    videoRefs.current[q.questionId] = el;
                  } else {
                    delete videoRefs.current[q.questionId];
                  }
                }}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}