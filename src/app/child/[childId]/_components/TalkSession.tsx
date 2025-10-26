'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { API } from '@/constants/api';
import { useMinimaxTTS } from '@/hooks/useMinimaxTTS';
import VideoRecorder from './VideoRecorder'; // VideoRecorder 경로에 맞게 수정
import { Fetcher } from '@/lib/fetcher';
import { useRouter } from 'next/navigation';
import TalkingCharacter from './TalkingCharacter';
import HistoryModal from './HistoryModal';
import ExitModal from './ExitModal';

import { ChatHistoryIcon, CloseIcon } from '../_components/Header';

type TalkMode = 'question' | 'free';

type QuestionItem = { ai: string; user: string | null };

type Props = {
  childId: string;
  initialSubjectId: number;
  initialQuestion: string;
  history: QuestionItem[];
  mode: TalkMode;
};

export default function TalkSession({
  childId,
  initialSubjectId,
  initialQuestion,
  history,
  mode,
}: Props) {
  const router = useRouter();

  // refs
  const subjectIdRef = useRef<number | null>(initialSubjectId);
  const finishedSentRef = useRef(false);
  const isSpeakingRef = useRef(false); // state

  const [question, setQuestion] = useState<string>(initialQuestion);
  const [displayText, setDisplayText] = useState('');
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const { isSpeaking, playStreamSmart, cancel, play } = useMinimaxTTS();

  useEffect(() => {
    // "question" 모드이고, history 배열에 항목이 1개 이상 있을 때만 모달을 엽니다.
    if (mode === 'question' && history.length > 0) {
      setIsHistoryModalOpen(true);
    }
  }, [mode, history]);

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
    setDisplayText('');
    // ⭐ 첫 진입에만 첫 문장 WebAudio 재생 → 이후는 스트리밍으로 이어짐
    playStreamSmart(initialQuestion, handleChunkDisplay, {
      firstChunkViaWebAudio: true,
    });
  }, [initialQuestion, playStreamSmart, handleChunkDisplay]);

  const resetUI = useCallback(() => {
    console.log(
      `[TalkSession] 대화 종료. ${`/child/${childId}/home`} 경로로 이동합니다.`,
    );
    window.location.href = `/child/${childId}/home`;
  }, [childId]);

  const handleExitConfirm = () => {
    setIsExitModalOpen(false);
    router.push(`/child/${childId}/home`);
  };

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
    <div className="relative isolate grid min-h-screen supports-[min-height:100dvh]:min-h-dvh place-items-center overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/child-bg.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* ✅ [수정] 모든 제어 버튼을 TalkSession 내부에 배치합니다. */}
      <div className="absolute top-6 right-6 z-40 flex items-center gap-4">
        {/* '오늘의 질문' 모드일 때만 '이전 기록' 버튼을 보여줍니다. */}
        {mode === 'question' && (
          <button
            onClick={() => setIsHistoryModalOpen(true)}
            className="p-3 bg-white/70 rounded-full shadow-lg hover:bg-white active:scale-95 transition-all"
            aria-label="이전 대화 기록"
            title="이전 대화 기록"
          >
            <ChatHistoryIcon />
          </button>
        )}

        {/* '나가기' 버튼 (CloseIcon) */}
        <button
          onClick={() => setIsExitModalOpen(true)}
          className="p-3 bg-white/70 rounded-full shadow-lg hover:bg-white active:scale-95 transition-all"
          aria-label="대화 그만하기"
          title="대화 그만하기"
        >
          <CloseIcon />
        </button>
      </div>
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
      />

      {/* ExitModal 컴포넌트 사용 */}
      <ExitModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onConfirm={handleExitConfirm}
      />

      {/* 2) 콘텐츠 */}
      <div className="relative z-10 p-6 flex items-center justify-center">
        {/* 캐릭터 (부리 스프라이트) */}

        <div
          className={`transition-transform duration-300 ${isSpeaking ? 'scale-[1.03]' : 'scale-100'}`}
        >
          <TalkingCharacter
            isSpeaking={isSpeaking}
            width={468}
            height={481} // 화면에서 보이는 크기
            baseSize={{ w: 931.99, h: 958.33 }} // 바디 원본(px)
            frameSize={{ w: 1000, h: 1000 }} // 프레임 원본(px) = 2000x1000의 1프레임
            beakAnchorPct={{ x: 0.5, y: 0.56 }} // 대략 값 → DevTools로 미세조정
            bodySrc="/images/talking-owlly.webp"
            beakSpriteSrc="/images/mouth-sprite.webp" // 2000x1000
          />
        </div>
        {/* ✅ [수정] isQuestionVisible이 항상 true이므로, isFinalMessage와 함께 묶어 조건부 렌더링을 단순화합니다. */}
        {/* 말풍선 */}
        <div className="relative z-10 w-full max-w-[460px] min-w-[280px] h-[280px] -top-32 ml-8 flex-shrink-0">
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
        {/* VideoRecorder */}
        <div className="relative z-10 ml-32 flex flex-col gap-8 text-center">
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
    </div>
  );
}
