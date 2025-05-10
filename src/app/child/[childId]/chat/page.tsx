'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReplyStepsStore } from '@/store/child/replyStepStore';
import VideoRecorder from '@/components/Recorder/VideoRecorder';
import { motion } from 'framer-motion';

export default function ReplyPage() {
  const { completedSteps, completeStep } = useReplyStepsStore();
  const router = useRouter();

  const [displayText, setDisplayText] = useState('');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isQuestionVisible, setIsQuestionVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const fullText = '이 질문에 대해 어떻게 생각하나요?';

  // 타이핑 효과
  useEffect(() => {
    if (!isQuestionVisible || message !== fullText) return;

    let index = 0;
    setDisplayText('');

    const interval = setInterval(() => {
      setDisplayText((prev) => {
        const nextText = prev + fullText[index];
        index++;
        if (index >= fullText.length) clearInterval(interval);
        return nextText;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isQuestionVisible, message]);

  // 말하는 중 입 애니메이션
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSpeaking) {
      interval = setInterval(() => {
        setMouthOpen((prev) => !prev);
      }, 250);
    } else {
      setMouthOpen(false);
    }
    return () => clearInterval(interval);
  }, [isSpeaking]);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleComplete = () => {
    completeStep();
    router.push('/child/video');
  };

  // TTS 테스트용 (3초 동안 입 애니메이션)
  const fakeTTSPlayback = () => {
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), 3000);
  };

  return (
    <div className="flex items-center justify-center h-screen relative p-6 bg-amber-100">
      {/* 캐릭터 */}
      <motion.img
        src={
          mouthOpen
            ? '/images/characterTalking.png'
            : '/images/characterDefault.png'
        }
        alt="캐릭터"
        width={500}
        height={500}
        onLoad={handleImageLoad}
        className={`transition-all duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
        animate={{ scale: isSpeaking ? 1.03 : 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* 말풍선 */}
      {isQuestionVisible && (
        <motion.div
          className="ml-16 w-96 min-h-32 bg-white p-6 rounded-lg shadow-sm border-2 border-i-orange"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xl font-semibold">{displayText}</p>
        </motion.div>
      )}

      {/* 버튼 또는 녹화 화면 */}
      <div className="ml-32 flex flex-col gap-8 text-center">
        {!isQuestionVisible ? (
          <>
            <button
              onClick={() => {
                setIsQuestionVisible(true);
                setMessage(fullText);
                fakeTTSPlayback(); // 나중에 실제 TTS 재생으로 대체
              }}
              className="w-64 px-8 py-6 text-lg bg-green-500 text-white rounded-lg shadow-lg"
            >
              질문에 응답할래
            </button>
            <button
              onClick={() => {
                setIsQuestionVisible(true);
                setMessage('얘기해봐!');
                setDisplayText('얘기해봐!');
                fakeTTSPlayback(); // 나중에 실제 TTS 재생으로 대체
              }}
              className="w-64 px-8 py-6 text-lg bg-blue-500 text-white rounded-lg shadow-lg"
            >
              나 하고 싶은 말이 있어
            </button>
          </>
        ) : (
          <VideoRecorder />
        )}
      </div>

      {/* 진행 상황 및 완료 버튼 */}
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
