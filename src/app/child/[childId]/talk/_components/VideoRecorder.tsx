'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Fetcher } from '@/lib/fetcher';
import { showError } from '@/lib/toast';

type SendMode = 'no-audio' | 'text-only' | 'with-uploads';

export default function VideoRecorder({
  childId,
  subjectId,
  isCharacterSpeaking,
  onAIResponse,
  onFinished,
}: {
  childId: string;
  subjectId: number | null;
  isCharacterSpeaking: boolean;
  onAIResponse: (message: string, isFinished: boolean) => void;
  onFinished: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const answerSentRef = useRef(false);
  const pendingUploadsRef = useRef<string[]>([]);
  const postedSetRef = useRef<Set<string>>(new Set());

  const recognizedTextRef = useRef('');
  const subjectIdRef = useRef(subjectId);

  // 말 멈춤 감지 타이머
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 두 비동기(녹화, 인식) 완료 동기화 플래그
  const isRecognitionFinishedRef = useRef(false);
  const videoBlobRef = useRef<Blob | null>(null);

  // ✅ 사전 캡처한 썸네일을 보관 (정지 후 캡처 블랙 방지)
  const thumbnailBlobRef = useRef<Blob | null>(null);

  useEffect(() => {
    subjectIdRef.current = subjectId;
  }, [subjectId]);

  const [isRecording, setIsRecording] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  // 🔑 기본값 false: 첫 질문 TTS가 끝나면 버튼이 켜질 수 있도록
  const [isWaitingForAI, setIsWaitingForAI] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);

  // 캐릭터가 말하지 않을 때는 항상 대기 해제 (역할 교대 보강)
  useEffect(() => {
    if (!isCharacterSpeaking) setIsWaitingForAI(false);
  }, [isCharacterSpeaking]);

  const postUploaded = useCallback(
    async (fileUrl: string | null) => {
      const currentSubjectId = subjectIdRef.current;
      if (!fileUrl || !currentSubjectId || !childId) {
        console.log('⚠️ /uploaded 전송 조건 불충족', {
          fileUrl,
          subjectId: currentSubjectId,
          childId,
        });
        return;
      }
      if (!answerSentRef.current) {
        pendingUploadsRef.current.push(fileUrl);
        return;
      }
      if (postedSetRef.current.has(fileUrl)) return;

      try {
        console.log('📤 /uploaded 전송:', {
          subjectId: currentSubjectId,
          file: fileUrl,
        });
        await Fetcher(`/child/${childId}/uploaded`, {
          method: 'POST',
          data: { subjectId: currentSubjectId, file: fileUrl },
        });
        postedSetRef.current.add(fileUrl);
        console.log('✅ 백엔드에 업로드 완료(/uploaded):', fileUrl);
      } catch (err) {
        console.error('❌ /uploaded 실패', err);
      }
    },
    [childId],
  );

  // =========================
  // 썸네일 사전 캡처 유틸
  // =========================
  // 비디오의 현재 프레임을 JPEG Blob으로 캡처 (ImageCapture → 캔버스 폴백)
  async function captureFrameToBlob(): Promise<Blob | null> {
    try {
      const v = videoRef.current;
      const c = canvasRef.current;
      if (!v || !c) return null;

      // 1) ImageCapture 우선
      const stream = v.srcObject as MediaStream | null;
      const track = stream?.getVideoTracks?.()[0];
      const hasImageCapture =
        typeof (window as any).ImageCapture === 'function';
      if (track && hasImageCapture) {
        try {
          // @ts-ignore
          const imgCap = new (window as any).ImageCapture(track);
          const bitmap: ImageBitmap = await imgCap.grabFrame();
          c.width = bitmap.width;
          c.height = bitmap.height;
          const ctx = c.getContext('2d');
          ctx?.drawImage(bitmap, 0, 0);
          return await new Promise<Blob | null>((resolve) =>
            c.toBlob((b) => resolve(b), 'image/jpeg', 0.92),
          );
        } catch {
          // 실패 시 폴백
        }
      }

      // 2) 캔버스 폴백: 메타데이터/페인트 보장 후 그리기
      const waitReady = async (attempts = 10) => {
        for (let i = 0; i < attempts; i++) {
          if (v.videoWidth > 0 && v.videoHeight > 0) return true;
          await new Promise((r) => setTimeout(r, 80));
        }
        return false;
      };
      if (!(await waitReady())) return null;

      await new Promise((r) => requestAnimationFrame(() => r(null)));

      c.width = v.videoWidth;
      c.height = v.videoHeight;
      const ctx = c.getContext('2d');
      ctx?.drawImage(v, 0, 0, v.videoWidth, v.videoHeight);

      return await new Promise<Blob | null>((resolve) =>
        c.toBlob((b) => resolve(b), 'image/jpeg', 0.92),
      );
    } catch {
      return null;
    }
  }

  // =========================
  // 업로드 유틸
  // =========================
  const captureAndUploadThumbnail = async () => {
    const currentSubjectId = subjectIdRef.current;
    if (!currentSubjectId || !childId) return;

    // ✅ 사전 캡처된 썸네일만 사용 (정지 후 블랙 방지)
    const blob = thumbnailBlobRef.current;
    if (!blob) {
      console.warn('⚠️ 썸네일 Blob이 없어 업로드를 생략합니다.');
      return;
    }

    console.log('🖼 사전 캡처 썸네일 업로드 시작...');
    const { data } = await Fetcher<{ url: string }>(
      `/child/${childId}/getURL`,
      {
        method: 'POST',
        data: { type: 'image', subjectId: currentSubjectId },
      },
    );
    if (!data?.url) {
      console.error('❌ 썸네일 URL 획득 실패');
      return;
    }

    const res = await fetch(data.url, {
      method: 'PUT',
      headers: { 'Content-Type': 'image/jpeg' }, // presign과 동일
      body: blob,
    });
    if (res.ok) {
      const s3Url = data.url.split('?')[0];
      console.log('✅ 썸네일 S3 업로드 완료:', s3Url);
      await postUploaded(s3Url);
    } else {
      const body = await res.text().catch(() => '');
      console.error('❌ 썸네일 업로드 실패', res.status, body);
    }
  };

  const uploadVideo = async (blob: Blob, type: 'video') => {
    const currentSubjectId = subjectIdRef.current;
    if (!currentSubjectId || !childId) return;

    const { data } = await Fetcher<{ url: string }>(
      `/child/${childId}/getURL`,
      {
        method: 'POST',
        data: { type, subjectId: currentSubjectId },
      },
    );
    if (!data?.url) {
      console.error(`❌ ${type} URL 획득 실패`);
      return;
    }

    // S3 서명과 동일해야 하는 Content-Type (코덱 파라미터 제거)
    const contentType = (blob.type || 'application/octet-stream').split(';')[0];

    const res = await fetch(data.url, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: blob,
    });
    if (res.ok) {
      const s3Url = data.url.split('?')[0];
      console.log(`✅ ${type} S3 업로드 완료:`, s3Url);
      await postUploaded(s3Url);
    } else {
      const body = await res.text().catch(() => '');
      console.error(`❌ ${type} 업로드 실패`, res.status, body);
    }
  };

  // =========================
  // 제출 흐름
  // =========================
  const sendAnswer = useCallback(
    async ({ mode }: { mode: SendMode }) => {
      setIsWaitingForAI(true);

      const currentRecognizedText = recognizedTextRef.current.trim();
      const currentSubjectId = subjectIdRef.current;

      if (!currentSubjectId || !childId) {
        setIsWaitingForAI(false);
        return;
      }

      // ✅ 텍스트 없음: 업로드 일절 금지 + 프론트 문구만 출력
      if (mode === 'no-audio') {
        const noAudioPrompts = [
          '인식된 음성이 없어요. 다시 말해볼까요?',
          '괜찮아. 천천히 생각해보고 다시 말해볼래?',
          '다른 질문을 해줄까?',
        ];
        const randomPrompt =
          noAudioPrompts[Math.floor(Math.random() * noAudioPrompts.length)];
        onAIResponse(randomPrompt, false);
        onFinished();
        setIsWaitingForAI(false); // 버튼 잠김 해제
        return;
      }

      // 서버 답변 요청 (텍스트만 또는 업로드 포함)
      const textToSend = currentRecognizedText;

      try {
        const { data, isSuccess } = await Fetcher<{
          finished: boolean;
          ai: string;
        }>(`/child/${childId}/answer`, {
          method: 'POST',
          data: { subjectId: currentSubjectId, text: textToSend },
        });

        if (isSuccess && data) {
          onAIResponse(data.ai, data.finished);
          onFinished();

          answerSentRef.current = true;

          if (mode === 'with-uploads') {
            if (videoBlobRef.current) {
              await uploadVideo(videoBlobRef.current, 'video');
              await captureAndUploadThumbnail();
            }
            for (const url of pendingUploadsRef.current) {
              await postUploaded(url);
            }
            pendingUploadsRef.current = [];
          } else {
            // text-only: 업로드는 일절 금지
            videoBlobRef.current = null;
            pendingUploadsRef.current = [];
          }
        } else {
          setIsWaitingForAI(false);
        }
      } catch (error) {
        console.error('❌ /answer API 호출 중 에러 발생:', error);
        setIsWaitingForAI(false);
      }
    },
    [childId, onAIResponse, onFinished, postUploaded],
  );

  const processFinalSubmission = useCallback(async () => {
    const hasText = !!recognizedTextRef.current.trim();
    const hasVideo = !!videoBlobRef.current;

    if (!hasText) {
      // 🎯 텍스트 없음: 업로드 전부 금지, 프론트 문구만
      await sendAnswer({ mode: 'no-audio' });
      return;
    }

    if (hasVideo) {
      await sendAnswer({ mode: 'with-uploads' });
    } else {
      await sendAnswer({ mode: 'text-only' });
    }
  }, [sendAnswer]);

  // =========================
  // STT
  // =========================
  const startSTT = () => {
    const SpeechRecognitionConstructor =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionConstructor) {
      showError('이 브라우저는 음성 인식을 지원하지 않습니다.');
      return;
    }
    const recognition: SpeechRecognition = new SpeechRecognitionConstructor();
    recognition.lang = 'ko-KR';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      setIsUserSpeaking(true);

      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        console.log('📝 확정 텍스트 추가:', finalTranscript);
        recognizedTextRef.current += finalTranscript + ' ';
      }

      speechTimeoutRef.current = setTimeout(() => {
        console.log('🎤 사용자 말 멈춤 감지 (타임아웃)');
        setIsUserSpeaking(false);
      }, 1000);
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      console.error('🎤 음성 인식 오류:', e);
    };

    recognition.onend = async () => {
      console.log('🏁 [SpeechRecognition] 완전히 종료됨.');
      isRecognitionFinishedRef.current = true;
      if (mediaRecorderRef.current === null) {
        await processFinalSubmission();
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // =========================
  // 녹화 제어
  // =========================
  const startRecording = async () => {
    if (isRecording || isStarting || mediaRecorderRef.current) return;

    setIsStarting(true);
    setIsUserSpeaking(false);
    isRecognitionFinishedRef.current = false;
    videoBlobRef.current = null;
    thumbnailBlobRef.current = null;

    try {
      console.log('🎬 녹화 시작 요청됨');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      recognizedTextRef.current = '';
      answerSentRef.current = false;
      pendingUploadsRef.current = [];
      postedSetRef.current.clear();

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch(() => {});
      }

      const chunks: BlobPart[] = [];
      // 일부 브라우저는 MimeType 지원 체크가 다름 → 안전하게 설정
      const preferred = 'video/webm;codecs=vp9,opus';
      const fallback = 'video/webm;codecs=vp8,opus';
      const options: MediaRecorderOptions = {
        mimeType: MediaRecorder.isTypeSupported?.(preferred)
          ? preferred
          : MediaRecorder.isTypeSupported?.(fallback)
            ? fallback
            : 'video/webm',
      };

      const recorder = new MediaRecorder(mediaStream, options);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      recorder.onstop = async () => {
        console.log('🛑 [MediaRecorder] 녹화 종료됨');
        mediaStream.getTracks().forEach((track) => track.stop());
        mediaRecorderRef.current = null;

        // ✅ Blob 생성 & 보관
        try {
          const blob = new Blob(chunks, {
            type: recorder.mimeType || 'video/webm',
          });
          videoBlobRef.current = blob;
          console.log('📦 비디오 Blob 준비 완료. size:', blob.size);
        } catch (e) {
          console.error('❌ 비디오 Blob 생성 실패:', e);
          videoBlobRef.current = null;
        }

        if (isRecognitionFinishedRef.current) {
          await processFinalSubmission();
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      startSTT();
    } catch (err) {
      console.error('❌ 녹화 시작 실패:', err);
      if (err instanceof Error) {
        switch (err.name) {
          case 'NotAllowedError':
            showError(
              '카메라와 마이크 권한을 허용해야 대화를 시작할 수 있어요.',
            );
            break;
          case 'NotFoundError':
            showError(
              '연결된 카메라나 마이크를 찾을 수 없어요. 기기를 확인해주세요.',
            );
            break;
          case 'NotReadableError':
            showError(
              '카메라나 마이크를 사용할 수 없어요. 다른 프로그램이 사용 중인지 확인해주세요.',
            );
            break;
          default:
            showError(
              '녹화를 시작하는 중 문제가 발생했습니다. 페이지를 새로고침 해주세요.',
            );
            break;
        }
      }
    } finally {
      setIsStarting(false);
    }
  };

  const stopRecording = async () => {
    console.log('🛑 사용자가 종료 버튼 클릭. 녹화 및 음성 인식을 중단합니다.');

    // ✅ 트랙 stop 하기 *전*에 프레임 한 컷 확보 (블랙 썸네일 방지)
    if (!thumbnailBlobRef.current) {
      const blob = await captureFrameToBlob();
      if (blob) {
        thumbnailBlobRef.current = blob;
        console.log('📸 썸네일(사전 캡처) 준비 완료:', blob.size);
      } else {
        console.warn('⚠️ 사전 썸네일 캡처 실패(계속 진행)');
      }
    }

    if (recognitionRef.current) recognitionRef.current.stop();
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);

    setIsRecording(false);
    setIsUserSpeaking(false);
  };

  // --- 디버깅: 버튼 비활성 이유 로그 ---
  const disabledReason = isCharacterSpeaking
    ? '캐릭터가 말하는 중'
    : isStarting
      ? '녹화 시작 준비 중'
      : isWaitingForAI
        ? 'AI 응답 대기 중'
        : '';

  useEffect(() => {
    console.log('[RecordBtn] disabledReason:', disabledReason, {
      isCharacterSpeaking,
      isStarting,
      isWaitingForAI,
    });
  }, [disabledReason, isCharacterSpeaking, isStarting, isWaitingForAI]);

  const feedbackText = isRecording
    ? isUserSpeaking
      ? '듣고 있어요...'
      : '지금 말씀해주세요!'
    : '버튼을 눌러 말해보세요!';

  return (
    <div
      className="flex flex-col justify-between items-center min-w-[300px] max-w-[400px] h-[580px] py-24 px-10 bg-contain bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/images/영상박스_점선.png')` }}
    >
      {/* 비디오 영역 */}
      <div
        className={`relative transition-all duration-300 rounded-lg ${
          isUserSpeaking
            ? 'ring-4 ring-green-400 ring-offset-2 animate-pulse'
            : ''
        }`}
      >
        <video
          ref={videoRef}
          className="w-80 h-60 bg-black rounded shadow-sm"
          autoPlay
          muted
          playsInline
        />
      </div>
      <canvas ref={canvasRef} className="hidden" />

      {/* 안내 문구 + 버튼 */}
      <div className="flex flex-col items-center gap-5">
        <div className="text-gray-700 w-80 p-2 bg-orange-200 rounded shadow-sm text-sm h-10 flex items-center justify-center">
          <strong className="transition-opacity duration-300">
            🎙️ {feedbackText}
          </strong>
        </div>

        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={isCharacterSpeaking || isStarting || isWaitingForAI}
            className="p-4 bg-i-lightgreen text-white rounded-full shadow-sm hover:scale-105 transition-transform disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
            title={disabledReason || '녹음 시작'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
              />
            </svg>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="p-4 bg-i-orange text-white rounded-full shadow-sm hover:scale-105 transition-transform"
            title="녹음 종료"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
