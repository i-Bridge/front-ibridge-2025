'use client';

import { useEffect, useState } from 'react';
import { useReplyStepsStore } from '@/store/child/replyStepStore';
import VideoRecorder from '@/components/Recorder/VideoRecorder';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { Fetcher } from '@/lib/fetcher';

export default function ReplyPage() {
  const { completedSteps, completeStep } = useReplyStepsStore();
  const { childId } = useParams();

  const [displayText, setDisplayText] = useState('');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isQuestionVisible, setIsQuestionVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [nextQuestion, setNextQuestion] = useState<string | null>(null);
  const [lastAIResponse, setLastAIResponse] = useState<string | null>(null);
  const [homeQuestion, setHomeQuestion] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRecordingFinished, setIsRecordingFinished] = useState(false); // ✅ 추가

  // ✅ 첫 질문 불러오기
  useEffect(() => {
    if (!childId) return;

    const fetchHomeData = async () => {
      const { data, isSuccess } = await Fetcher<{
        question: string;
        isCompleted: boolean;
      }>(`/child/${childId}/home`, { method: 'GET' });

      if (isSuccess && data) {
        setHomeQuestion(data.question);
        setIsCompleted(data.isCompleted);
      }
    };

    fetchHomeData();
  }, [childId]);

  // ✅ 타이핑 효과
  useEffect(() => {
    if (!isQuestionVisible || message !== homeQuestion) return;

    let index = 0;
    let currentText = '';

    const interval = setInterval(() => {
      if (index < homeQuestion.length) {
        currentText += homeQuestion[index];
        setDisplayText(currentText);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isQuestionVisible, message, homeQuestion]);

  // ✅ 입 움직임 애니메이션
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

  const handleImageLoad = () => setIsImageLoaded(true);

  // ✅ TTS 기능
  const speak = (text: string) => {
    if (!text || typeof window === 'undefined') return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.pitch = 1.4;
    utterance.rate = 0.8;

    setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleNextStep = () => {
    completeStep();
    setMessage('');
    setDisplayText('');
    setNextQuestion(lastAIResponse ?? null);
    if (lastAIResponse) speak(lastAIResponse);
    setLastAIResponse(null);
    setIsRecordingFinished(false); // ✅ 초기화
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
          <p className="text-xl font-semibold">{nextQuestion || displayText}</p>
        </motion.div>
      )}

      {/* 질문 시작 버튼들 */}
      <div className="ml-32 flex flex-col gap-8 text-center">
        {!isQuestionVisible ? (
          <>
            {!isCompleted && (
              <button
                onClick={() => {
                  setIsQuestionVisible(true);
                  setMessage(homeQuestion);
                  speak(homeQuestion); // ✅ 읽기
                }}
                className="w-64 px-8 py-6 text-lg bg-green-500 text-white rounded-lg shadow-lg"
              >
                질문에 응답할래
              </button>
            )}
            <button
              onClick={() => {
                setIsQuestionVisible(true);
                setMessage('얘기해봐!');
                setDisplayText('얘기해봐!');
                speak('얘기해봐!');
              }}
              className="w-64 px-8 py-6 text-lg bg-blue-500 text-white rounded-lg shadow-lg"
            >
              나 하고 싶은 말이 있어
            </button>
          </>
        ) : (
          <VideoRecorder
            subjectId={completedSteps + 1}
            onAIResponse={(ai: string) => {
              setLastAIResponse(ai);
              speak(ai); // ✅ AI 응답도 읽기
            }}
            onFinished={() => {
              setIsRecordingFinished(true); // ✅ 녹화 완료 시점
            }}
          />
        )}
      </div>

      {/* 다음 질문 버튼 (녹화 완료 후 표시) */}
      {isQuestionVisible && isRecordingFinished && (
        <div className="absolute bottom-20 flex flex-col items-center gap-6">
          <p className="text-xl font-semibold">
            현재 단계: {completedSteps + 1} / 5
          </p>
          <button
            onClick={handleNextStep}
            className="px-6 py-4 bg-blue-500 text-white text-lg rounded-lg"
          >
            다음 질문
          </button>
          <button
            onClick={() => {
              setIsQuestionVisible(false);
              setDisplayText('');
              setNextQuestion(null);
              setIsRecordingFinished(false); // ✅ 초기화
              window.speechSynthesis.cancel();
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
