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
  const [isRecordingFinished, setIsRecordingFinished] = useState(false);
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
    <div className="flex items-center justify-center h-screen relative p-6 bg-violet-100">
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
          <p className="text-xl font-semibold">
            수고했어요! 오늘의 대화를 마쳤어요.
          </p>
        </div>
      ) : (
        <>
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
                    setQuestion(ai);
                    setDisplayText(ai);
                    speak(ai);
                    setIsRecordingFinished(false);
                  }}
                  onFinished={() => {
                    console.log('✅ 녹화 완료됨');
                    setIsRecordingFinished(true);
                  }}
                  onConversationFinished={() => {
                    setIsFinalMessage(true);
                    setIsQuestionVisible(false);
                  }}
                />
              )
            )}
          </div>

          {isQuestionVisible && isRecordingFinished && (
            <div className="absolute bottom-20 flex flex-col items-center gap-6">
              <button
                onClick={() => {
                  console.log('🔁 질문 다시 듣기 클릭됨');
                  speak(question);
                }}
                className="px-6 py-4 bg-orange-400 text-white text-lg rounded-lg"
              >
                질문 다시 듣기
              </button>
              <button
                onClick={() => {
                  console.log('🔙 뒤로가기 클릭됨');
                  setIsQuestionVisible(false);
                  setDisplayText('');
                  setIsRecordingFinished(false);
                  setQuestion('');
                  setSubjectId(null);
                  setIsFinalMessage(false);
                  window.speechSynthesis.cancel();
                }}
                className="w-16 h-16 bg-white rounded-lg flex items-center justify-center"
              >
                <img
                  src="/images/home.png"
                  alt="홈으로 가기"
                  className="w-12 h-12"
                />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
