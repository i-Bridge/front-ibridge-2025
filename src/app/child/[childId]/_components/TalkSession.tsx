'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { API } from '@/constants/api';
import { useMinimaxTTS } from '@/hooks/useMinimaxTTS';
import VideoRecorder from './VideoRecorder'; // VideoRecorder 경로에 맞게 수정
import { Fetcher } from '@/lib/fetcher';
import { useRouter } from 'next/navigation';
import TalkingCharacter from './TalkingCharacter';
import HistoryModal from './HistoryModal';
import ExitModal from './header/ChatExitModal';
import { DotWaves } from '@/ui/loading/DotWaves';
import { ChatHistoryIcon, ExitIcon } from '@/ui/icon/icon';
import ChildHeaderLayout from './header/ChildHeader';
import FullscreenToggle from './header/FullscreenToggle';

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
  const [isWaiting, setIsWaiting] = useState(false);

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
    const completePath = `/child/${childId}/complete`; // ✅ 새 완료 페이지 경로
    console.log(`[TalkSession] 대화 종료. ${completePath} 경로로 이동합니다.`);
    router.push(completePath); // ✅ router.push로 변경
  }, [childId, router]); // ✅ router를 의존성 배열에 추가

  const handleExitConfirm = () => {
    setIsExitModalOpen(false);
    router.push(`/child/${childId}/home`);
  };

  const handleAIResponse = useCallback(
    async (ai: string, isFinished: boolean) => {
      setIsWaiting(false);
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
          '[AI 응답] 마지막 TTS 재생 완료. 2초 후 완료 페이지로 이동합니다.',
        );
        // 2-3. TTS 재생이 모두 끝나면, 2초 후 페이지를 이동시킵니다.
        setTimeout(resetUI, 2000);
      } else {
        // 마지막 응답이 아니라면, 그냥 다음 TTS를 재생합니다.
        await playStreamSmart(ai, handleChunkDisplay);
      }
    },
    [playStreamSmart, handleChunkDisplay, resetUI, sendFinished],
  );

  return (
    <div
      className="
      relative isolate min-h-screen supports-[min-height:100dvh]:min-h-dvh overflow-hidden
      bg-white/10 backdrop-blur-[10px]    /* 모바일 기본 */
      md:bg-transparent md:backdrop-blur-0
    "
    >
      {/* 배경 이미지 */}
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

      {/* 헤더: 모바일에선 간단 버튼바, md↑ 기존 레이아웃 유지 */}
      <div className="md:hidden h-16 px-5 flex justify-end items-center gap-3">
        <FullscreenToggle />
        {mode === 'question' && (
          <button
            onClick={() => setIsHistoryModalOpen(true)}
            className="w-10 h-10 bg-white rounded-xl inline-flex justify-center items-center active:scale-105 transition-all"
            aria-label="이전 대화 기록"
            title="이전 대화 기록"
          >
            <ChatHistoryIcon />
          </button>
        )}
        <button
          onClick={() => setIsExitModalOpen(true)}
          className="w-10 h-10 bg-white rounded-xl inline-flex justify-center items-center active:scale-105 transition-all"
          aria-label="대화 그만하기"
          title="대화 그만하기"
        >
          <ExitIcon />
        </button>
      </div>

      {/* 데스크톱 헤더 */}
      <div className="hidden md:block">
        <ChildHeaderLayout
          left={<FullscreenToggle />}
          right={
            <>
              {mode === 'question' && (
                <button
                  onClick={() => setIsHistoryModalOpen(true)}
                  className="w-10 h-10 bg-white rounded-xl inline-flex justify-center items-center active:scale-105 transition-all"
                  aria-label="이전 대화 기록"
                  title="이전 대화 기록"
                >
                  <ChatHistoryIcon />
                </button>
              )}
              <button
                onClick={() => setIsExitModalOpen(true)}
                className="w-10 h-10 bg-white rounded-xl inline-flex justify-center items-center active:scale-105 transition-all"
                aria-label="대화 그만하기"
                title="대화 그만하기"
              >
                <ExitIcon />
              </button>
            </>
          }
        />
      </div>

      {/* 모달들 */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
      />
      <ExitModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onConfirm={handleExitConfirm}
      />

      {/* 본문 */}
      <div
        className="
          relative z-10 w-full
          flex flex-col items-center justify-between
          px-5 md:px-6
          pb-[max(16px,env(safe-area-inset-bottom))] md:pb-0
          gap-6 md:gap-8
          md:flex-row md:place-items-center md:justify-center
        "
      >
        {/* 1) 말풍선 + 캐릭터 */}
        <div
          className="
            flex flex-col items-center justify-center
            w-full md:w-[590px] md:h-[736px]
            gap-4 md:gap-0
          "
        >
          {/* 말풍선 */}
          <div className="w-full md:h-[180px] flex items-start md:items-center justify-center">
            <div
              className="
                relative flex flex-col items-center justify-center
                w-full max-w-[480px]
                px-10 py-7 md:pt-[28px] md:pb-[28px] md:px-[40px]
                rounded-3xl bg-grayscale-gray80 text-white shadow-lg
                after:hidden md:after:block
                md:after:content-[''] md:after:absolute md:after:left-1/2 md:after:-translate-x-1/2
                md:after:w-5 md:after:h-5 md:after:bg-grayscale-gray80 md:after:bottom-[-8px] md:after:rotate-45 md:after:rounded-[4px]
              "
            >
              {isWaiting ? (
                <div className="flex justify-center items-center py-1.5">
                  <DotWaves className="bg-white" />
                </div>
              ) : (
                <p className="font-bold text-base md:text-xl leading-[1.6] text-center break-words whitespace-pre-wrap">
                  {displayText}
                </p>
              )}

              {/* 모바일에선 ‘다시 듣기’ 버튼 숨김(오조작 방지), md↑ 표시 */}
              <button
                onClick={() => void play(question)}
                className="hidden md:inline-flex absolute bottom-0 right-0 translate-y-1/2 p-4 bg-white rounded-full transition-all hover:scale-105 active:scale-95"
                aria-label="다시 듣기"
                title="다시 듣기"
              >
                {/* 기존 SVG 그대로 */}
                <svg
                  width="22"
                  height="18"
                  viewBox="0 0 22 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.3335 2.16992V7.19972H6.36329"
                    stroke="#FF6B31"
                    strokeWidth="2.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19.7759 15.5825V10.5527H14.7461"
                    stroke="#FF6B31"
                    strokeWidth="2.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.6719 6.3618C17.2468 5.16033 16.5242 4.08615 15.5716 3.23948C14.619 2.39281 13.4675 1.80125 12.2244 1.52C10.9814 1.23874 9.68735 1.27696 8.46307 1.63108C7.23879 1.98521 6.12416 2.6437 5.2232 3.54511L1.3335 7.20009M19.7761 10.5533L15.8864 14.2083C14.9854 15.1097 13.8708 15.7682 12.6465 16.1223C11.4222 16.4764 10.1282 16.5146 8.88513 16.2334C7.64209 15.9521 6.49054 15.3606 5.53796 14.5139C4.58537 13.6672 3.86278 12.5931 3.43763 11.3916"
                    stroke="#FF6B31"
                    strokeWidth="2.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* 캐릭터: 모바일 크기 줄이고 간격 보정 */}
          <div
            className={`transition-transform duration-300 ${isSpeaking ? 'scale-[1.03]' : 'scale-100'}`}
          >
            {/* 모바일에선 캐릭터 박스 여백 확보 */}
            <div className="md:mt-0 mt-2">
              <TalkingCharacter
                isSpeaking={isSpeaking}
                width={468}
                height={481}
                baseSize={{ w: 931.99, h: 958.33 }}
                frameSize={{ w: 1000, h: 1000 }}
                beakAnchorPct={{ x: 0.5, y: 0.56 }}
                bodySrc="/images/talking-owlly.webp"
                beakSpriteSrc="/images/mouth-sprite.webp"
              />
            </div>
          </div>
        </div>

        {/* 2) 비디오 레코더 */}
        <div
          className="
            flex flex-col items-center justify-center gap-6
            w-full md:w-[590px] md:h-[736px]
          "
        >
          <div className="flex items-center justify-center w-44 h-44 md:w-[360px] md:h-[360px]">
            {initialSubjectId ? (
              <VideoRecorder
                childId={childId}
                subjectId={initialSubjectId}
                isCharacterSpeaking={isSpeaking}
                onWaitingChange={setIsWaiting}
                onAIResponse={handleAIResponse}
                onFinished={() => console.log('✅ 녹화 완료')}
              />
            ) : (
              <div className="text-white/90">대화 세션을 준비 중입니다...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
