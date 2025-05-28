'use client';

import { useEffect, useState } from 'react';
import VideoRecorder from '@/components/Recorder/VideoRecorder';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { Fetcher } from '@/lib/fetcher';

export default function ReplyPage() {
  const { childId } = useParams();

  const [question, setQuestion] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isQuestionVisible, setIsQuestionVisible] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState<boolean | null>(null);
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [isFinalMessage, setIsFinalMessage] = useState(false);

  useEffect(() => {
    if (!childId) return;

    const fetchHomeData = async () => {
      console.log('📥 /home API 호출');
      const { data, isSuccess } = await Fetcher<{ completed: boolean }>(
        `/child/${childId}/home`,
        { method: 'GET' },
      );
      if (isSuccess && data) {
        console.log('✅ /home 응답:', data);
        setIsCompleted(data.completed);
      } else {
        console.error('❌ /home API 실패');
        setIsCompleted(false);
      }
    };

    fetchHomeData();
  }, [childId]);

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
    console.log('💬 말풍선 질문 타이핑 시작:', question);
    return () => clearInterval(interval);
  }, [isQuestionVisible, question]);

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

  useEffect(() => {
    const img = new Image();
    img.src = '/images/characterDefault.png';
    img.onload = () => setIsImageLoaded(true);
  }, []);

  // 강제 종료 처리
  useEffect(() => {
    const handleUnload = () => {
      if (subjectId && childId) {
        const payload = JSON.stringify({ subjectId });
        const blob = new Blob([payload], { type: 'application/json' });
        const url = `${process.env.NEXT_PUBLIC_API_URL}/child/${childId}/finished`;

        const result = navigator.sendBeacon(url, blob);

        if (result) {
          console.log('📡 sendBeacon 전송됨: subjectId =', subjectId);
        } else {
          console.warn('⚠️ sendBeacon 실패 (fallback 필요할 수도 있음)');
        }
      } else {
        console.log('⚠️ sendBeacon 조건 불충족:', { subjectId, childId });
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [subjectId, childId]);

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

  return (
    <div className="flex items-center justify-center h-screen relative p-6 bg-i-skyblue">
      <button
        onClick={() => {
          console.log('🏠 홈으로 가기 클릭됨');
          setIsFinalMessage(false);
          setIsQuestionVisible(false);
          setDisplayText('');
          setQuestion('');
          setSubjectId(null);
        }}
        className="fixed top-12 left-12 z-50 p-4 pl-8 hover:scale-105 transition-transform bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/homeBtnBg.png')", // 버튼 배경
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6 mr-1 mt-2 text-gray-600 drop-shadow"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      </button>

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

      {isFinalMessage ? (
        <div className="absolute bottom-32 bg-white p-6 rounded-lg shadow-md border-2 border-i-orange">
          <p className="text-xl font-semibold">{displayText}</p>
        </div>
      ) : (
        <>
          {isQuestionVisible && (
            <>
              <div className="relative ml-16 w-[460px] h-[280px]">
                {/* 애니메이션 포함된 말풍선 박스 */}
                <motion.div
                  className="relative w-full h-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* 배경 이미지 */}
                  <img
                    src="/images/speechBubbleBg.png"
                    alt="말풍선 배경"
                    className="absolute inset-0 w-full h-full object-contain"
                  />

                  {/* 내용 */}
                  <div className="relative z-10 flex flex-col items-center justify-center gap-4 h-full p-6">
                    <p className="text-xl font-semibold text-gray-900 text-center">
                      {displayText}
                    </p>

                    <button
                      onClick={() => {
                        console.log('🔁 질문 다시 듣기 클릭됨');
                        speak(question);
                      }}
                      className="absolute right-8 top-1/2 -translate-y-1/2 transition-transform hover:scale-110"
                      style={{
                        background: 'transparent',
                        padding: 0,
                        border: 'none',
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 text-orange-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              </div>
            </>
          )}

          <div className="ml-32 flex flex-col gap-8 text-center">
            {isCompleted !== null && !isQuestionVisible ? (
              <>
                {!isCompleted && (
                  <button
                    onClick={async () => {
                      setIsQuestionVisible(true);
                      setDisplayText('');
                      console.log(
                        '🟢 질문에 응답할래 버튼 클릭 → /predesigned 호출',
                      );

                      const { data, isSuccess } = await Fetcher<{
                        subjectId: number;
                        question: string;
                      }>(`/child/${childId}/predesigned`, {
                        method: 'GET',
                      });

                      if (isSuccess && data) {
                        console.log('✅ /predesigned 응답:', data);
                        setQuestion(data.question);
                        setSubjectId(data.subjectId);
                        speak(data.question);
                      } else {
                        console.error('❌ /predesigned API 실패');
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
                    console.log(
                      '🟦 나 하고 싶은 말이 있어 버튼 클릭 → /new 호출',
                    );

                    const { data, isSuccess } = await Fetcher<{
                      subjectId: number;
                    }>(`/child/${childId}/new`, { method: 'GET' });

                    if (isSuccess && data) {
                      console.log('✅ /new 응답:', data);
                      setSubjectId(data.subjectId);
                      setQuestion('얘기해봐!');
                      speak('얘기해봐!');
                    } else {
                      console.error('❌ /new API 실패');
                    }
                  }}
                  className="w-64 px-8 py-6 text-lg bg-blue-500 text-white rounded-lg shadow-lg"
                >
                  나 하고 싶은 말이 있어
                </button>
              </>
            ) : (
              subjectId !== null && (
                <VideoRecorder
                  subjectId={subjectId}
                  onAIResponse={(ai: string) => {
                    console.log('✅ 백엔드에서 받은 ai 응답:', ai);
                    if (ai === '수고했어! 내일 또 만나~') {
                      setIsFinalMessage(true);
                      setIsQuestionVisible(false);
                    }
                    setQuestion(ai);
                    setDisplayText(ai);
                    speak(ai);
                  }}
                  onFinished={() => {
                    console.log('✅ 녹화 완료됨');
                  }}
                  onConversationFinished={() => {
                    setIsFinalMessage(true);
                    setIsQuestionVisible(false);
                  }}
                />
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}
