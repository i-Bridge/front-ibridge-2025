'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Fetcher } from '@/lib/fetcher';
import { useMinimaxTTS } from '@/hooks/useMinimaxTTS';
import VideoRecorder from '@/components/Recorder/VideoRecorder';
import { API } from '@/constants/emotions';

type TalkMode = 'question' | 'free';

type Props = {
  childId: string; // ✅ string으로 고정
  mode: TalkMode;
};

export default function TalkSession({ childId, mode }: Props) {
  // refs
  const childIdRef = useRef<string | null>(childId);
  useEffect(() => {
    childIdRef.current = childId;
  }, [childId]);

  const subjectIdRef = useRef<number | null>(null);
  const finishedSentRef = useRef(false);
  const isSpeakingRef = useRef(false);

  // state
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [question, setQuestion] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [isQuestionVisible, setIsQuestionVisible] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [isFinalMessage, setIsFinalMessage] = useState(false);

  // TTS
  const { speak, cancel, isSpeaking } = useMinimaxTTS();
  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  // mouth toggle
  useEffect(() => {
    let id: NodeJS.Timeout | undefined;
    if (isSpeaking) id = setInterval(() => setMouthOpen((p) => !p), 250);
    else setMouthOpen(false);
    return () => id && clearInterval(id);
  }, [isSpeaking]);

  // preload images
  useEffect(() => {
    ['/images/characterDefault.png', '/images/characterTalking.png'].forEach(
      (src) => {
        const img = new window.Image();
        img.src = src;
      },
    );
  }, []);

  useEffect(() => {
    subjectIdRef.current = subjectId;
  }, [subjectId]);

  // typing
  useEffect(() => {
    if (!isQuestionVisible || !question) return;
    let i = 0,
      cur = '';
    setDisplayText('');
    const id = setInterval(() => {
      if (i < question.length) {
        cur += question[i++];
        setDisplayText(cur);
      } else clearInterval(id);
    }, 100);
    return () => clearInterval(id);
  }, [isQuestionVisible, question]);

  // unload → finished
  useEffect(() => {
    const onUnload = () => sendFinished();
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // unmount → stop speech
  useEffect(
    () => () => {
      setMouthOpen(false);
      cancel();
    },
    [cancel],
  );

  // start (mode별 엔드포인트만 다름)
  const handleStart = useCallback(async () => {
    setIsQuestionVisible(true);
    setDisplayText('');

    if (mode === 'question') {
      const { data, isSuccess } = await Fetcher<{
        subjectId: number;
        question: string;
      }>(API.predesigned(childId), { method: 'GET' });
      if (isSuccess && data) {
        setSubjectId(data.subjectId);
        setQuestion(data.question);
        speak(data.question);
      }
    } else {
      const { data, isSuccess } = await Fetcher<{ subjectId: number }>(
        API.new(childId),
        { method: 'GET' },
      );
      if (isSuccess && data) {
        setSubjectId(data.subjectId);
        const first = '얘기해봐!';
        setQuestion(first);
        speak(first);
      }
    }
  }, [childId, mode, speak]);

  // next question from AI
  const handleAIResponse = useCallback(
    (ai: string) => {
      setQuestion(ai);
      speak(ai);
    },
    [speak],
  );

  // finished
  const sendFinished = useCallback(() => {
    if (finishedSentRef.current) return;
    const sid = subjectIdRef.current;
    const cid = childIdRef.current;
    if (!sid || !cid) return;

    const url = `${process.env.NEXT_PUBLIC_API_URL}${API.finished(cid)}`;
    const payload = JSON.stringify({ subjectId: sid });

    try {
      const blob = new Blob([payload], { type: 'application/json' });
      const ok = navigator.sendBeacon?.(url, blob);
      if (ok) {
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

  const resetUI = useCallback(() => {
    setIsFinalMessage(false);
    setIsQuestionVisible(false);
    setDisplayText('');
    setQuestion('');
    setSubjectId(null);
    setMouthOpen(false);
  }, []);

  const handleConversationFinished = useCallback(() => {
    setIsFinalMessage(true);
    sendFinished();
    const done = () => {
      cancel();
      resetUI();
    };
    if (isSpeakingRef.current) {
      const watcher = setInterval(() => {
        if (!isSpeakingRef.current) {
          clearInterval(watcher);
          setTimeout(done, 1000);
        }
      }, 100);
    } else {
      setTimeout(done, 1000);
    }
  }, [cancel, sendFinished, resetUI]);

  const startBtn = useMemo(
    () => ({
      bg:
        mode === 'question'
          ? "url('/images/대화박스_분홍.png')"
          : "url('/images/대화박스_연두.png')",
      label:
        mode === 'question'
          ? '오늘의 질문을 시작해봐'
          : '하고 싶은 이야기를 시작해봐',
    }),
    [mode],
  );

  return (
    <div className="flex items-center justify-center h-screen relative p-6 bg-i-skyblue">
      {/* 캐릭터 */}
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
          onLoad={() => setIsImageLoaded(true)}
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
                  onClick={() => speak(question)}
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

      {/* 우측 패널 */}
      <div className="ml-32 flex flex-col gap-8 text-center">
        {!isQuestionVisible ? (
          <button
            onClick={handleStart}
            className="w-72 h-28 relative hover:scale-105 transition-transform"
            style={{
              backgroundImage: startBtn.bg,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
            }}
          >
            <span className="absolute inset-0 flex items-center justify-center text-lg text-gray-800 mt-2 mr-2">
              {startBtn.label}
            </span>
          </button>
        ) : (
          subjectId !== null && (
            <VideoRecorder
              subjectId={subjectId}
              onAIResponse={handleAIResponse}
              onFinished={() => console.log('✅ 녹화 완료')}
              onConversationFinished={handleConversationFinished}
            />
          )
        )}
      </div>
    </div>
  );
}
