/*
 * 파일 경로: src/app/parent/[childId]/_components/Question/QuestionCard.tsx
 * (이 코드로 덮어쓰세요)
 */
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
  <div className="w-15 h-15 p-5 bg-black/40 rounded-full flex justify-center items-center">
    <svg
      className="w-full h-full"
      width="20"
      height="20"
      viewBox="0 0 14 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.5635 8.10171C17.8968 8.87151 17.8968 10.796 16.5635 11.5658L3.00048 19.3964C1.66715 20.1662 0.000487378 19.204 0.000487445 17.6644L0.00048813 2.00316C0.000488197 0.463559 1.66715 -0.498688 3.00049 0.271113L16.5635 8.10171Z"
        fill="white"
      />
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
    // [FIX] API 응답의 image/video가 null일 수 있는 경우를 대비
    const imageUrl = question.image || '/images/emotion-blank.webp'; // 기본 이미지
    const videoUrl = question.video; // 비디오 URL

    return (
      <div className=" rounded-[20px] flex flex-col justify-center items-center gap-1.5 overflow-hidden relative flex-shrink-0">
        
        {/* [FIX] isPlaying이 true이고 videoUrl이 있을 때만 비디오 재생 */}
        {isPlaying && videoUrl ? (
          // 비디오 재생 상태
          <video
            ref={videoRef}
            controls
            onEnded={onVideoEnd}
            className="w-full h-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          // 썸네일 상태
          <div
            // [FIX] videoUrl이 있을 때만 클릭 가능하도록 수정
            className={videoUrl ? 'relative cursor-pointer w-full h-full' : 'relative w-full h-full'}
            onClick={videoUrl ? onPlayClick : undefined}
          >
            {/* 썸네일 이미지 */}
            <Image
              src={imageUrl} // [FIX] 오류 방지를 위해 null 대신 기본 이미지(imageUrl) 사용
              alt={question.text || '대화 썸네일'} // [FIX] alt 텍스트 기본값
              width={192}
              height={192}
              className="w-full h-full object-cover"
            />
            
            {/* [FIX] videoUrl이 있을 때만 플레이 버튼 오버레이 표시 */}
            {videoUrl && (
              <div className="absolute inset-0 flex items-center justify-center">
                <PlayIcon />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-auto p-8 bg-grayscale-gray5 rounded-[20px] flex flex-col lg:flex-row justify-start items-start gap-7">
      {/* 1. 비디오/썸네일 영역 */}
      {renderVideoOrThumbnail()}

      {/* 2. 텍스트 영역 */}
      <div className=" flex flex-col justify-start items-start gap-3">
        {/* 질문 제목 */}
        <div className=" inline-flex justify-start items-start gap-3">
          <Text variant={'title04'} className="">
            {question.text} {/* 질문이 제목 역할을 한다고 가정 */}
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