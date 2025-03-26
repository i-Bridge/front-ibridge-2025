'use client';

import Image from 'next/image';
import { useReplyStepsStore } from '@/store/child/replyStepStore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ReplyPage() {
  const { completedSteps, completeStep } = useReplyStepsStore();
  const router = useRouter();
  const [displayText, setDisplayText] = useState('');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const fullText = '이 질문에 대해 어떻게 생각하나요?';

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length - 1) {
        // index가 fullText의 길이를 초과하지 않도록
        setDisplayText((prev) => prev + fullText[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval); // 컴포넌트가 언마운트될 때 interval을 정리
  }, []);

  const handleComplete = () => {
    completeStep();
    router.push('/child/video');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen relative p-6">
      {/* 제목 */}
      <h1 className="absolute top-4 left-1/2 transform -translate-x-1/2 text-2xl font-bold">
        답변 페이지
      </h1>

      {/* 캐릭터 자리 */}
      <div className="absolute left-24 top-1/2 transform -translate-y-2/3">
        <Image
          src="/images/characterDefault.png"
          alt="캐릭터"
          width={500}
          height={500}
          layout="intrinsic" // 이미지 크기 자동 조정
          onLoadingComplete={handleImageLoad} // 로딩 완료 후 상태 업데이트
          className={`transition-all duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`} // 로딩 중에는 opacity 0으로 숨기기
        />

        {/* 말풍선 자리 (캐릭터 오른쪽) */}
        <motion.div
          className="absolute left-full top-1/4 ml-16 w-96 min-h-32 bg-white p-4 rounded-lg shadow-md border"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xl">{displayText}</p>{' '}
        </motion.div>
      </div>
      {/* 현재 단계 표시 및 완료 버튼 */}
      <div className="absolute top-2/3">
        <p className="mt-4 text-lg">현재 단계: {completedSteps + 1} / 5</p>
        <button
          onClick={handleComplete}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
        >
          완료
        </button>
      </div>

      {/* 영상 통화 화면 자리 */}
      <div className="absolute bottom-32 right-10 w-60 h-40 bg-white flex items-center justify-center text-lg font-bold">
        영상
      </div>
    </div>
  );
}
