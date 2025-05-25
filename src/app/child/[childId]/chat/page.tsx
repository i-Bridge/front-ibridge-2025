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

  const [question, setQuestion] = useState(''); // 질문 텍스트 보관
  const [displayText, setDisplayText] = useState(''); // 타이핑 애니메이션용 텍스트
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isQuestionVisible, setIsQuestionVisible] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRecordingFinished, setIsRecordingFinished] = useState(false);
  const [subjectId, setSubjectId] = useState<number | null>(null);

  useEffect(() => {
    if (!childId) return;

    const fetchHomeData = async () => {
      const { data, isSuccess } = await Fetcher<{
        isCompleted: boolean;
      }>(`/child/${childId}/home`, { method: 'GET' });
      if (isSuccess && data) {
        setIsCompleted(data.isCompleted);
      }
    };

    fetchHomeData();
  }, [childId]);

  // ✅ 타이핑 애니메이션
  useEffect(() => {
    if (!isQuestionVisible || !question) return;

    let index = 0;
    let currentText = '';

    const interval = setInterval(() => {
      if (index < question.length) {
        currentText += question[index];
        setDisplayText(currentText);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    console.log('💬 말풍선에 출력할 전체 질문:', question);
    return () => clearInterval(interval);
  }, [isQuestionVisible, question]);

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

  // ✅ 캐시 대비 이미지 사전 로드
  useEffect(() => {
    const img = new Image();
    img.src = '/images/characterDefault.png';
    img.onload = () => setIsImageLoaded(true);
  }, []);

  const handleImageLoad = () => setIsImageLoaded(true);

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
    setDisplayText('');
    setIsRecordingFinished(false);
    speak(question);
  };

  return (
    <div className="flex items-center justify-center h-screen relative p-6 bg-amber-100">
      {/* 캐릭터 이미지 */}
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

      {/* 버튼 영역 */}
      <div className="ml-32 flex flex-col gap-8 text-center">
        {!isQuestionVisible ? (
          <>
            {!isCompleted && (
              <button
                onClick={async () => {
                  setIsQuestionVisible(true);
                  setDisplayText('');

                  // ✅ /predesigned API 호출
                  const { data, isSuccess } = await Fetcher<{
                    subjectId: number;
                    question: string;
                  }>(`/child/${childId}/predesigned`, {
                    method: 'GET',
                  });

                  if (isSuccess && data) {
                    setQuestion(data.question); // ✅ 질문 저장
                    setSubjectId(data.subjectId); // ✅ 녹화용 subjectId 저장 (위에서 상태 만들어야 함)
                    speak(data.question); // ✅ 음성 읽기
                  } else {
                    console.error('❌ 사전 질문 불러오기 실패');
                  }
                }}
                className="w-64 px-8 py-6 text-lg bg-green-500 text-white rounded-lg shadow-lg"
              >
                질문에 응답할래
              </button>
            )}

            <button
              onClick={async () => {
                setIsQuestionVisible(true);
                setDisplayText('');

                const { data, isSuccess } = await Fetcher<{
                  subjectId: number;
                }>(`/child/${childId}/new`, { method: 'GET' });

                if (isSuccess && data) {
                  setSubjectId(data.subjectId);
                  setQuestion('얘기해봐!');
                  speak('얘기해봐!');
                } else {
                  console.error('❌ 새 질문(subjectId) 발급 실패');
                }
              }}
              className="w-64 px-8 py-6 text-lg bg-blue-500 text-white rounded-lg shadow-lg"
            >
              나 하고 싶은 말이 있어
            </button>
          </>
        ) : (
          <VideoRecorder
            subjectId={subjectId}
            onAIResponse={(ai: string) => {
              console.log('✅ 백엔드에서 받은 ai 응답:', ai);
              setQuestion(ai); // ✅ 다음 질문 덮어쓰기
              setDisplayText(''); // 타이핑 초기화
              speak(ai); // TTS 재생
            }}
            onFinished={() => {
              setIsRecordingFinished(true); // 녹화 완료
            }}
          />
        )}
      </div>

      {/* 다음 질문 버튼 */}
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
              setIsRecordingFinished(false);
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
