'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { API } from '@/constants/api';
import { useMinimaxTTS } from '@/hooks/useMinimaxTTS';
import VideoRecorder from './VideoRecorder'; // VideoRecorder 경로에 맞게 수정
import { Fetcher } from '@/lib/fetcher';

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
  // refs
  const subjectIdRef = useRef<number | null>(initialSubjectId);
  const finishedSentRef = useRef(false);
  const isSpeakingRef = useRef(false); // state

  const [subjectId, setSubjectId] = useState<number>(initialSubjectId);
  const [question, setQuestion] = useState<string>(initialQuestion);
  const [displayText, setDisplayText] = useState('');
  // ✅ [수정] isQuestionVisible은 이제 항상 true로 시작하여, 시작 버튼 없이 바로 대화 화면을 보여줍니다.
  const [isQuestionVisible, setIsQuestionVisible] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [isFinalMessage, setIsFinalMessage] = useState(false);

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

  // subjectId state가 변경될 때마다 ref도 함께 업데이트합니다.
  useEffect(() => {
    subjectIdRef.current = subjectId;
  }, [subjectId]);

  // ✅ [추가] 컴포넌트가 사라질 때(언마운트) 실행될 클린업 함수입니다.
  // 사용자가 뒤로가기, 다른 페이지 이동 등으로 이 컴포넌트를 벗어날 때 호출됩니다.
  useEffect(() => {
    return () => {
      console.log(
        '[TalkSession] 언마운트! TTS 재생 중지 및 대화 종료 신호 전송.',
      );
      // 1. 진행 중인 모든 오디오 출력을 중단시킵니다.
      cancel();
      // 2. 백엔드에 대화가 종료되었음을 알립니다.
      void sendFinished();
    };
  }, [cancel, sendFinished]); // 의존성 배열에 함수들을 추가합니다.

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
        // 2-1. UI를 '마지막 메시지' 상태로 바꾸고, /finished API를 '먼저' 호출합니다.
        setIsFinalMessage(true);
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
      {/* ✅ [수정] isQuestionVisible이 항상 true이므로, isFinalMessage와 함께 묶어 조건부 렌더링을 단순화합니다. */}

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
      )}

      <div className="ml-32 flex flex-col gap-8 text-center">
        {subjectId ? ( // subjectId가 초기화되지 않았을 때만 렌더링
          <VideoRecorder
            childId={childId}
            subjectId={subjectId}
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
