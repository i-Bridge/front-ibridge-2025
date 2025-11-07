// app/parent/[childId]/answerLog/_components/QuestionCard.tsx (경로를 AnalysisList와 유사하게 가정)
'use client';

import Image from 'next/image';
import { Question } from '@/types/index'; 
import { Text } from '@/ui/Text';

type QuestionCardProps = {
  question: Question;
  videoRef: React.RefCallback<HTMLVideoElement>; // videoRefs.current[id] = el; 역할을 합니다.
  isPlaying: boolean;
  onPlayClick: () => void;
  onVideoEnd: () => void;
};

// 재생 아이콘 컴포넌트 (HTML 구조에서 복사)
const PlayIcon = () => (
<div  className="w-15 h-15 p-5 bg-black/40 rounded-full flex justify-center items-center">
  <svg
    // [수정] w-full h-full 추가하여 부모 div의 전체 공간을 차지하도록 합니다.
    className="w-full h-full"
    width="20"
    height="20"
    viewBox="0 0 14 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M16.5635 8.10171C17.8968 8.87151 17.8968 10.796 16.5635 11.5658L3.00048 19.3964C1.66715 20.1662 0.000487378 19.204 0.000487445 17.6644L0.00048813 2.00316C0.000488197 0.463559 1.66715 -0.498688 3.00049 0.271113L16.5635 8.10171Z" fill="white"/>
  </svg>
</div>
);

export default function QuestionCard({
  question,
  videoRef,
  isPlaying,
  onPlayClick,
  onVideoEnd,
}: QuestionCardProps) {
  // HTML 구조와 AnalysisList의 로직을 결합하여 renderVideoOrThumbnail을 QuestionCard 내부에서 처리합니다.
  const renderVideoOrThumbnail = () => {
    // [HTML Input] w-48 h-48 rounded-[20px] 이미지 컨테이너 구조 사용
    return (
      <div className="w-48 h-48 rounded-[20px] flex flex-col justify-center items-center gap-1.5 overflow-hidden relative flex-shrink-0">
        
        {isPlaying ? (
          // 비디오 재생 상태
          <video
            ref={videoRef}
            controls
            onEnded={onVideoEnd}
            // [UX] 부모 컨테이너(w-48 h-48)를 가득 채우도록 w-full h-full object-cover 적용
            className="w-full h-full object-cover" 
          >
            <source src={question.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          // 썸네일 상태
          <div
            className="relative cursor-pointer w-full h-full"
            onClick={onPlayClick}
          >
            {/* 썸네일 이미지 */}
            <Image
              src={question.image}
              alt={question.text}
              // [UX/성능] 부모 크기(w-48 h-48)에 맞춤 (192px)
              width={192} 
              height={192}
              className="w-full h-full object-cover"
            />
            {/* 플레이 버튼 오버레이 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayIcon />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    // [HTML Input] 최상위 컨테이너 구조
    <div
      className="w-full self-stretch p-8 bg-grayscale-gray5 rounded-[20px] flex flex-col justify-start items-start gap-7"
    >
      {/* 1. 비디오/썸네일 영역 */}
      {renderVideoOrThumbnail()}

      {/* 2. 텍스트 영역 */}
      <div className="self-stretch flex flex-col justify-start items-start gap-3">
        
        {/* 질문 제목 */}
        <div className="self-stretch inline-flex justify-start items-start gap-3">
          <Text variant={'title04'} className="">
            { question.text} {/* 질문이 제목 역할을 한다고 가정 */}
          </Text>
        </div>
        
        {/* 답변 내용 */}
        <div className="self-stretch flex flex-col justify-start items-start gap-3">
          <Text variant={'body04'} className="text-grayscale-gray70">
            {question.answer}
          </Text>
        </div>
      </div>
    </div>
  );
}