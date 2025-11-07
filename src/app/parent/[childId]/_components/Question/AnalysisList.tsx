// app/parent/[childId]/answerLog/_components/AnalysisList.tsx (수정)
'use client';

import { useState, useRef } from 'react';
import { useSubjectData } from '@/hooks/parentHome/useSubjectData';
import { Question } from '@/types/index';
import { Text } from '@/ui/Text';

// [수정 1] QuestionCard 컴포넌트를 import 합니다. (경로는 실제 위치에 맞게 수정)
import QuestionCard from './QuestionCard';
import ParentLayout from '../Layout/ParentLayout';
import { DeleteIcon } from '@/ui/icon/icon';

// [Question Type 가정]: Question 타입에는 questionId, text, answer, video, image가 포함되어야 합니다.
// export interface Question { questionId: number; title?: string; text: string; answer: string; video: string; image: string; }

export default function AnalysisList() {
  const { questions } = useSubjectData();
  const [playingMap, setPlayingMap] = useState<{ [key: number]: boolean }>({});
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  // [수정 2] 데이터 로딩 상태 확인 및 예외 처리 (Suspense와 함께 사용 시 여기서는 로딩 스켈레톤 처리는 불필요)
  if (!questions) return null;
  // if (questions.length === 0) return <EmptyPlaceholder>데이터 없음</EmptyPlaceholder>; // 데이터가 없을 때 처리

  const handlePlayClick = (questionId: number) => {
    setPlayingMap((prev) => ({ ...prev, [questionId]: true }));
    // videoRefs를 이용하여 비디오를 재생합니다.
    setTimeout(() => {
      videoRefs.current[questionId]?.play();
    }, 0);
  };

  const handleVideoEnd = (questionId: number) => {
    setPlayingMap((prev) => ({ ...prev, [questionId]: false }));
  };

  // [수정 3] renderQuestionCard 함수 삭제

  return (
    // [수정] 배경 색상 및 패딩 클래스 제거 (컨테이너 역할만 남김)
    // padding, gap 등은 QuestionCard 내부에서 처리되도록 합니다.
    <ParentLayout
      containerClassName=" min-w-[200px] self-stretch self-stretch border-l border-grayscale-gray20 inline-flex flex-col justify-start items-start"
      title={
        <div className='w-full self-stretch flex flex-col gap-3'>
        <div className='flex gap-2 justify-between'>
          <Text variant={'caption03'}>2025년 10월 09일</Text>
          <button>
          <DeleteIcon/>
          </button>
        </div>
        <Text variant={'title04'}>
         서브젝트 제목 연결
        </Text>
        </div>
      }
    >
      {/* questions 배열을 순회하며 QuestionCard를 렌더링합니다.
        각 카드에 필요한 상태 관리 함수와 참조를 props로 전달합니다.
      */}
      {questions.map((q: Question) => (
        <QuestionCard
          key={q.questionId}
          question={q}
          isPlaying={!!playingMap[q.questionId]}
          onPlayClick={() => handlePlayClick(q.questionId)}
          onVideoEnd={() => handleVideoEnd(q.questionId)}
          // 비디오 Ref를 QuestionCard 내부의 <video> 태그에 연결하기 위한 콜백 함수
          videoRef={(el) => {
            videoRefs.current[q.questionId] = el;
          }}
        />
      ))}
    </ParentLayout>
  );
}
