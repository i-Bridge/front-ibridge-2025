'use client';

import { useState, useRef } from 'react';
import { useSubjectData } from '@/hooks/parentHome/useSubjectData';
import { Text } from '@/ui/Text';
import QuestionCard from './QuestionCard';
import ParentLayout from '../../_components/Layout/ParentLayout';
import { DeleteIcon } from '@/ui/icon/icon';
import { formatDateWithDay } from '@/hooks/formatDateWithDay';
import { useSubjectStore } from '@/store/useSubjectStore';

export default function AnalysisList() {
  // useSubjectData에서 subject와 questions를 가져옵니다.
  const { subject, questions, loading } = useSubjectData();
  const [playingMap, setPlayingMap] = useState<{ [key: number]: boolean }>({});
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const { setSelectedSubjectId } = useSubjectStore();

  // 데이터가 없거나 로딩 중일 경우 return null
  if (loading || !subject || !questions) return null;

  // 질문이 없을 때도 return null 처리
  if (questions.length === 0) return <div>질문이 없습니다.</div>;

  // 영상 재생 시작 처리
  const handlePlayClick = (questionId: number) => {
    setPlayingMap((prev) => ({ ...prev, [questionId]: true }));
    setTimeout(() => {
      videoRefs.current[questionId]?.play();
    }, 0);
  };

  // 영상 끝났을 때 처리
  const handleVideoEnd = (questionId: number) => {
    setPlayingMap((prev) => ({ ...prev, [questionId]: false }));
  };

  return (
    <ParentLayout
      containerClassName="overflow-h-auto self-stretch border-l border-grayscale-gray20 flex flex-col justify-start items-start"
      title={
        <div className="w-full self-stretch flex flex-col gap-3">
          <div className="flex gap-2 justify-center items-center">
            {/* subject의 date를 사용하여 날짜 표시 */}
            <Text variant={'caption03'}>{formatDateWithDay(subject.date)}</Text>
            <button onClick={() => setSelectedSubjectId(null)}>
              <DeleteIcon />
            </button>
          </div>
          {/* subject의 title을 사용하여 제목 표시 */}
          <Text variant={'title04'} className='text-center mt-4'>{subject.subjectTitle}</Text>
        </div>
      }
    >
      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto w-auto flex flex-col gap-3 ">
        {questions.map((q) => (
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
