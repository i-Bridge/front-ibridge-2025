// app/parent/[childId]/answerLog/_components/AnalysisList.tsx (수정)
'use client';

import { useState, useRef } from 'react';
import { useSubjectData } from '@/hooks/parentHome/useSubjectData';
import { Question } from '@/types/index';
import { Text } from '@/ui/Text';

import QuestionCard from './QuestionCard';
import ParentLayout from '../../_components/Layout/ParentLayout';
import { DeleteIcon } from '@/ui/icon/icon';

// ... (Question 타입, handlePlayClick, handleVideoEnd 등은 동일) ...
// export interface Question { questionId: number; title?: string; text: string; answer: string; video: string; image: string; }

export default function AnalysisList() {
  const { questions } = useSubjectData();
  const [playingMap, setPlayingMap] = useState<{ [key: number]: boolean }>({});
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  if (!questions) return null;

  const handlePlayClick = (questionId: number) => {
    setPlayingMap((prev) => ({ ...prev, [questionId]: true }));
    setTimeout(() => {
      videoRefs.current[questionId]?.play();
    }, 0);
  };

  const handleVideoEnd = (questionId: number) => {
    setPlayingMap((prev) => ({ ...prev, [questionId]: false }));
  };

  return (
    <ParentLayout
      // [✨ 수정] 'inline-flex'를 'flex'로 변경합니다.
      // 이렇게 하면 AnalysisList가 부모(SubjectPopup)의 flex 레이아웃에서
      // 예측 가능한 블록 레벨 요소로 작동하여 정렬이 깨지지 않습니다.
      containerClassName="h-full min-w-[200px] self-stretch border-l border-grayscale-gray20 flex flex-col justify-start items-start"
      title={
        <div className="w-full self-stretch flex flex-col gap-3">
          <div className="flex gap-2 justify-between">
            <Text variant={'caption03'}>2025년 10월 09일</Text>
            <button>
              <DeleteIcon />
            </button>
          </div>
          <Text variant={'title04'}>서브젝트 제목 연결</Text>
        </div>
      }
    >
      {/* 스크롤 영역 (이전 수정과 동일) */}
      <div className="flex-1 overflow-y-auto w-full">
        {questions.map((q: Question) => (
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
        ))}
      </div>
    </ParentLayout>
  );
}