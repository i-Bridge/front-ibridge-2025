'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { API } from '@/constants/api';
import { useMinimaxTTS } from '@/hooks/useMinimaxTTS';
import VideoRecorder from './VideoRecorder'; // VideoRecorder 경로에 맞게 수정
import { Fetcher } from '@/lib/fetcher';
import { useRouter } from 'next/navigation';

type Props = {
  childId: string;
  initialSubjectId: number;
  initialQuestion: string;
};

export default function TalkSession({
  childId,
  initialSubjectId,
  initialQuestion,
}: Props) {
  const router = useRouter();

  // refs
  const subjectIdRef = useRef<number | null>(initialSubjectId);
  const finishedSentRef = useRef(false);
  const isSpeakingRef = useRef(false); // state

  const [question, setQuestion] = useState<string>(initialQuestion);
  const [displayText, setDisplayText] = useState('');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  // ✅ [수정] useMinimaxTTS 훅에서 오디오 중단/재생을 위한 cancel과 play 함수를 가져옵니다.
  const { isSpeaking, playStreamSmart, cancel, play } = useMinimaxTTS();

  // ✅ [수정] sendFinished를 useCallback으로 감싸고, 중복 호출 방지 로직을 강화했습니다.
  const sendFinished = useCallback(async () => {
    if (finishedSentRef.current) return;
    const sid = subjectIdRef.current;
    if (!sid || !childId) return;

    finishedSentRef.current = true; // 중복 전송 방지를 위해 즉시 true로 설정
    console.log(`[TalkSession] /finished API 호출 (subjectId: ${sid})`);

    try {
      // 인증 헤더가 자동으로 포함되는 Fetcher를 사용합니다.
      await Fetcher(API.finished(childId), {
        method: 'POST',
        data: { subjectId: sid },
      });
      console.log(`[TalkSession] /finished API 호출 성공`);
    } catch (err) {
      // Fetcher가 내부적으로 에러를 잘 로깅해주므로, 여기서는 경고만 남깁니다.
      console.warn('⚠️ /finished API 호출 실패', err);
    }
  }, [childId]);

  const handleChunkDisplay = useCallback((chunk: string, isFirst: boolean) => {
    if (isFirst) {
      setDisplayText(chunk);
    } else {
      setDisplayText((prev) => prev + ' ' + chunk);
    }
  }, []);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]); // 캐릭터 입 모양 토글 애니메이션

  useEffect(() => {
    let id: NodeJS.Timeout | undefined;
    if (isSpeaking) id = setInterval(() => setMouthOpen((p) => !p), 250);
    else setMouthOpen(false);
    return () => id && clearInterval(id);
  }, [isSpeaking]); // 캐릭터 이미지 프리로드

  useEffect(() => {
    ['/images/characterDefault.png', '/images/characterTalking.png'].forEach(
      (src) => {
        new window.Image().src = src;
      },
    );
  }, []);

  // ✅ [수정] useEffect 클린업 로직을 '소멸성'과 '비소멸성'으로 분리하여 엄격 모드에 대응합니다.

  // 1. 비소멸성 클린업: TTS 중단(cancel)은 언제든지 안전하게 실행할 수 있습니다.
  useEffect(() => {
    return () => {
      console.log('[TalkSession] 언마운트 감지, TTS 재생을 중단합니다.');
      cancel();
    };
  }, [cancel]);

  // 2. 소멸성 클린업: /finished API 호출은 '진짜 언마운트' 시에만 실행되어야 합니다.
  const didMountRef = useRef(false);
  useEffect(() => {
    // 엄격 모드의 두 번째(진짜) 마운트부터 didMountRef.current는 true가 됩니다.
    if (didMountRef.current) {
      // 진짜 마운트 이후의 클린업 함수 (진짜 언마운트 시 실행됨)
      return () => {
        console.log('[TalkSession] 진짜 언마운트! /finished API를 호출합니다.');
        void sendFinished();
      };
    } else {
      // 첫 번째 마운트 시에는 ref 값을 true로 설정하기만 합니다.
      // 이로 인해 엄격 모드의 '가짜' 언마운트 시에는 아무 일도 일어나지 않습니다.
      didMountRef.current = true;
    }
  }, [sendFinished]);

  // ✅ [추가] 브라우저 탭/창을 닫을 때를 위한 종료 처리 로직입니다.
  useEffect(() => {
    const onUnload = () => void sendFinished();
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, [sendFinished]);

  // ✅ [추가] 컴포넌트가 마운트되자마자, prop으로 받은 첫 질문을 바로 재생하는 로직입니다.
  useEffect(() => {
    console.log('[TalkSession] 시작! 첫 질문 재생:', initialQuestion);
    setDisplayText(''); // 타이핑 효과를 위해 초기화
    playStreamSmart(initialQuestion, handleChunkDisplay);
  }, [initialQuestion, playStreamSmart, handleChunkDisplay]);

  const resetUI = useCallback(() => {
    console.log(
      `[TalkSession] 대화 종료. ${`/child/${childId}/talk`} 경로로 이동합니다.`,
    );
    window.location.href = `/child/${childId}/talk`;
  }, [childId]);

  const handleAIResponse = useCallback(
    async (ai: string, isFinished: boolean) => {
      // 1. 다음 질문(ai)을 상태에 설정합니다.
      setQuestion(ai);

      // 2. 만약 이것이 마지막 응답이라면...
      if (isFinished) {
        console.log(
          '[AI 응답] 마지막 응답 감지. /finished API를 먼저 호출합니다.',
        );

        await sendFinished();

        // 2-2. 그 다음, 마지막 TTS를 재생합니다.
        await playStreamSmart(ai, handleChunkDisplay);

        console.log(
          '[AI 응답] 마지막 TTS 재생 완료. 3초 후 페이지를 이동합니다.',
        );
        // 2-3. TTS 재생이 모두 끝나면, 3초 후 페이지를 이동시킵니다.
        setTimeout(resetUI, 3000);
      } else {
        // 마지막 응답이 아니라면, 그냥 다음 TTS를 재생합니다.
        await playStreamSmart(ai, handleChunkDisplay);
      }
    },
    [playStreamSmart, handleChunkDisplay, resetUI, sendFinished],
  );
  return (
    <div
      className="flex items-center justify-center h-screen relative p-6 overflow-hidden"
      style={{
        backgroundImage: "url('/images/fantasy-forest-bg.png')", // 배경 이미지 경로
        backgroundSize: 'cover', // 화면을 꽉 채우도록 설정
        backgroundPosition: 'center', // 이미지가 중앙에 위치하도록 설정
        backgroundRepeat: 'no-repeat', // 이미지가 반복되지 않도록 설정
      }}
    >
      <button
        onClick={() => setIsExitModalOpen(true)} // 바로 이동하는 대신 모달을 엽니다.
        className="absolute top-6 right-6 z-50 p-3 bg-white/70 rounded-full shadow-lg hover:bg-white active:scale-95 transition-all"
        aria-label="대화 그만하기"
        title="대화 그만하기"
      >
        {/* 집 아이콘 SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 text-gray-700"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5"
          />
        </svg>
      </button>

      {/* ✅ [추가] 나가기 확인 모달 (실수 방지 장치) */}
      {isExitModalOpen && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="w-[90vw] max-w-sm p-6 bg-white rounded-2xl shadow-xl text-center"
          >
            <h3 className="text-xl font-bold text-gray-800">
              잠깐! 벌써 가는 거야?
            </h3>
            <p className="mt-2 text-gray-600">
              괜찮아, 언제든 다시 돌아와서 이야기를 이어갈 수 있어!
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setIsExitModalOpen(false)}
                className="px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                계속할래
              </button>
              <button
                onClick={() => router.push(`/child/${childId}/talk`)}
                className="px-8 py-3 bg-orange-400 text-white font-semibold rounded-lg hover:bg-orange-500 transition-colors"
              >
                그만할래
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 캐릭터 */}
      <motion.div
        className={`translate-y-[20px] transition-all duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
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
      {/* ✅ [수정] isQuestionVisible이 항상 true이므로, isFinalMessage와 함께 묶어 조건부 렌더링을 단순화합니다. */}

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

            <button
              onClick={() => void play(question)}
              className="absolute right-6 top-1/2 -translate-y-1/2 transition-transform hover:scale-110"
              style={{
                background: 'transparent',
                padding: 0,
                border: 'none',
              }}
              aria-label="다시 듣기"
              title="다시 듣기"
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

      <div className="ml-32 flex flex-col gap-8 text-center">
        {initialSubjectId ? ( // subjectId가 초기화되지 않았을 때만 렌더링
          <VideoRecorder
            childId={childId}
            subjectId={initialSubjectId}
            isCharacterSpeaking={isSpeaking}
            onAIResponse={handleAIResponse}
            onFinished={() => console.log('✅ 녹화 완료')}
          />
        ) : (
          // subjectId가 없는 경우를 대비한 UI (예: 로딩 스피너)
          <div>대화 세션을 준비 중입니다...</div>
        )}
      </div>
    </div>
  );
}
