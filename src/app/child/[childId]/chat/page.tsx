'use client';

import { useCallback, useEffect, useRef, useMemo, useState } from 'react';
import VideoRecorder from '@/components/Recorder/VideoRecorder';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { Fetcher } from '@/lib/fetcher';
import Image from 'next/image';

export default function ReplyPage() {
  const { childId } = useParams();
  const numericChildId = useMemo(() => Number(childId), [childId]);
  // 보조 ref (언마운트/이벤트 핸들러에서 최신값 접근용)
  const subjectIdRef = useRef<number | null>(null);
  const childIdRef = useRef<number | null>(null);
  const finishedSentRef = useRef(false);

  const [question, setQuestion] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isQuestionVisible, setIsQuestionVisible] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState<boolean | null>(null);
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [isFinalMessage, setIsFinalMessage] = useState(false);

  const cancelSpeech = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!text || typeof window === 'undefined') return;

      cancelSpeech();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.pitch = 1.4;
      utterance.rate = 0.8;

      setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [cancelSpeech],
  );

  const handleAIResponse = useCallback(
    (ai: string) => {
      console.log('✅ 백엔드에서 받은 ai 응답:', ai);
      setQuestion(ai);
      speak(ai);
    },
    [speak],
  );

  const handleConversationFinished = useCallback(() => {
    console.log('🎉 대화 종료됨');

    setIsFinalMessage(true);
  }, []);

  // 공통 전송 함수
  const sendFinished = useCallback(() => {
    if (finishedSentRef.current) return;

    const sid = subjectIdRef.current;
    const cid = childIdRef.current;
    if (!sid || !cid) return;

    const url = `${process.env.NEXT_PUBLIC_API_URL}/child/${cid}/finished`;
    const payload = JSON.stringify({ subjectId: sid });

    try {
      const blob = new Blob([payload], { type: 'application/json' });
      const ok = navigator.sendBeacon?.(url, blob);
      if (ok) {
        console.log('📡 /finished sendBeacon OK', { sid, cid });
        finishedSentRef.current = true;
        return;
      }
    } catch {}

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: payload,
    })
      .then(() => {
        finishedSentRef.current = true;
      })
      .catch((err) => console.warn('⚠️ /finished fetch FAIL', err));
  }, []);

  // 강제 종료 + 새로고침
  useEffect(() => {
    const handleUnload = () => {
      sendFinished();
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [sendFinished]);

  const handleGoHome = useCallback(() => {
    console.log('🏠 홈으로 가기 클릭됨');
    sendFinished();
    setIsFinalMessage(false);
    setIsQuestionVisible(false);
    setDisplayText('');
    setQuestion('');
    setSubjectId(null);
    setIsSpeaking(false);
    setMouthOpen(false);
    cancelSpeech();
  }, [cancelSpeech]);

  useEffect(() => {
    return () => {
      console.log('🛑 ReplyPage 언마운트 → 캐릭터 상태 초기화 및 음성 중지');
      setIsSpeaking(false);
      setMouthOpen(false);
      cancelSpeech();
    };
  }, [cancelSpeech]);

  useEffect(() => {
    subjectIdRef.current = subjectId;
  }, [subjectId]);

  useEffect(() => {
    const n = Number(childId);
    childIdRef.current = Number.isFinite(n) ? n : null;
  }, [childId]);

  useEffect(() => {
    if (!numericChildId) return;

    const fetchHomeData = async () => {
      console.log('📥 /home API 호출');
      const { data, isSuccess } = await Fetcher<{ completed: boolean }>(
        `/child/${numericChildId}/home`,
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
  }, [numericChildId]);

  useEffect(() => {
    if (!isQuestionVisible || !question) return;

    let index = 0;
    let currentText = '';
    setDisplayText(''); // 초기화

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

  // 이미지 preload 처리 → 두 이미지 모두 선로드
  useEffect(() => {
    const preloadImages = [
      '/images/characterDefault.png',
      '/images/characterTalking.png',
    ];
    preloadImages.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  return (
    <div className="flex items-center justify-center h-screen relative p-6 bg-i-skyblue">
      {/* 홈 버튼 */}
      <button
        onClick={handleGoHome}
        className="fixed top-12 left-12 z-50 p-4 pl-8 hover:scale-105 transition-transform bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/homeBtnBg.png')",
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

      {/* 캐릭터 이미지 */}
      <motion.div
        className={`relative bottom-[-50px] transition-all duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
        animate={{ scale: isSpeaking ? 1.03 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={
            mouthOpen
              ? '/images/characterTalking.png'
              : '/images/characterDefault.png'
          }
          alt="캐릭터"
          width={500}
          height={500}
          priority
          onLoadingComplete={() => setIsImageLoaded(true)}
        />
      </motion.div>

      {(isFinalMessage || isQuestionVisible) && (
        <div className="relative w-full max-w-[460px] min-w-[280px] h-[280px] -top-32 ml-8 flex-shrink-0">
          <motion.div
            className="relative w-full h-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/images/speechBubbleBg.png"
              alt="말풍선 배경"
              fill
              className="object-contain"
              priority
            />
            <div className="relative z-10 flex flex-col items-center justify-center gap-4 h-full p-6">
              <p className="text-xl text-gray-900 text-center break-words whitespace-pre-wrap px-10 leading-relaxed">
                {displayText}
              </p>
              {isQuestionVisible && (
                <button
                  onClick={() => {
                    console.log('🔁 질문 다시 듣기 클릭됨');
                    speak(question);
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 transition-transform hover:scale-110"
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
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* 하단 버튼 or 녹화기 */}
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
                  }>(`/child/${numericChildId}/predesigned`, { method: 'GET' });

                  if (isSuccess && data) {
                    console.log('✅ /predesigned 응답:', data);
                    setQuestion(data.question);
                    setSubjectId(data.subjectId);
                    speak(data.question);
                  } else {
                    console.error('❌ /predesigned API 실패');
                  }
                }}
                className="w-72 h-28 relative hover:scale-105 transition-transform"
                style={{
                  backgroundImage: "url('/images/대화박스_분홍.png')",
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                }}
              >
                <span className="absolute inset-0 flex items-center justify-center text-lg text-gray-800 mt-2 mr-2">
                  질문에 응답할래
                </span>
              </button>
            )}

            <button
              onClick={async () => {
                setIsQuestionVisible(true);
                setDisplayText('');
                console.log('🟦 나 하고 싶은 말이 있어 버튼 클릭 → /new 호출');

                const { data, isSuccess } = await Fetcher<{
                  subjectId: number;
                }>(`/child/${numericChildId}/new`, { method: 'GET' });

                if (isSuccess && data) {
                  console.log('✅ /new 응답:', data);
                  setSubjectId(data.subjectId);
                  setQuestion('얘기해봐!');
                  speak('얘기해봐!');
                } else {
                  console.error('❌ /new API 실패');
                }
              }}
              className="w-72 h-28 relative hover:scale-105 transition-transform"
              style={{
                backgroundImage: "url('/images/대화박스_연두.png')",
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
              }}
            >
              <span className="absolute inset-0 flex items-center justify-center text-lg text-gray-800 mt-2 mr-2">
                하고 싶은 말이 있어
              </span>
            </button>
          </>
        ) : (
          subjectId !== null && (
            <VideoRecorder
              subjectId={subjectId}
              onAIResponse={handleAIResponse}
              onFinished={() => {
                console.log('✅ 녹화 완료됨');
              }}
              onConversationFinished={() => {
                handleConversationFinished();
                handleGoHome();
              }}
            />
          )
        )}
      </div>
    </div>
  );
}
