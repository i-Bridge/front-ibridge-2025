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
  const fullText = '이 질문에 대해 어떻게 생각하나요?';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) => prev + fullText[index]);
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
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
        />

        {/* 말풍선 자리 (캐릭터 오른쪽) */}
        <motion.div
          className="absolute left-full top-1/4 ml-16 w-96 min-h-32 bg-white p-4 rounded-lg shadow-md border"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xl">{displayText}</p>{' '}
          {/* 글씨 크기를 2xl로 설정 */}
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
