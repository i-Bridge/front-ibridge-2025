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
  const [isQuestionVisible, setIsQuestionVisible] = useState(false);
  const [message, setMessage] = useState('');
  const fullText = '이 질문에 대해 어떻게 생각하나요?';

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  useEffect(() => {
    if (!isQuestionVisible || message !== fullText) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length - 1) {
        setDisplayText((prev) => prev + fullText[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isQuestionVisible, message]);

  const handleComplete = () => {
    completeStep();
    router.push('/child/video');
  };

  return (
    <div className="flex items-center justify-center h-screen relative p-6 bg-amber-100">
      {/* 캐릭터 */}
      <Image
        src="/images/characterDefault.png"
        alt="캐릭터"
        width={500}
        height={500}
        layout="intrinsic"
        onLoadingComplete={handleImageLoad}
        className={`transition-all duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* 말풍선 */}
      {isQuestionVisible && (
        <motion.div
          className="ml-16 w-96 min-h-32 bg-white p-6 rounded-lg shadow-sm border-2 border-i-orange"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xl font-semibold">{message}</p>
        </motion.div>
      )}

      {/* 버튼 또는 녹화 화면 */}
      <div className="ml-16 flex flex-col gap-6 text-center">
        {!isQuestionVisible ? (
          <>
            <button
              onClick={() => {
                setIsQuestionVisible(true);
                setMessage(fullText);
              }}
              className="w-64 px-8 py-6 text-lg bg-green-500 text-white rounded-lg shadow-lg"
            >
              질문에 응답할래
            </button>
            <button
              onClick={() => {
                setIsQuestionVisible(true);
                setMessage('얘기해봐!');
              }}
              className="w-64 px-8 py-6 text-lg bg-blue-500 text-white rounded-lg shadow-lg"
            >
              나 하고 싶은 말이 있어
            </button>
          </>
        ) : (
          <div className="w-72 h-48 bg-white flex items-center justify-center text-lg font-bold shadow-lg rounded-lg">
            녹화 화면
          </div>
        )}
      </div>

      {/* 현재 단계 및 완료 버튼 */}
      {isQuestionVisible && (
        <div className="absolute bottom-20 flex flex-col items-center gap-6">
          <p className="text-xl font-semibold">
            현재 단계: {completedSteps + 1} / 5
          </p>
          <button
            onClick={handleComplete}
            className="px-6 py-4 bg-blue-500 text-white text-lg rounded-lg"
          >
            완료
          </button>
          <button
            onClick={() => {
              setIsQuestionVisible(false);
              setDisplayText('');
            }}
            className="px-6 py-4 bg-red-500 text-white text-lg rounded-lg"
          >
            뒤로가기
          </button>
        </div>
      )}
    </div>
  );
}
