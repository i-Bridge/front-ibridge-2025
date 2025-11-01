'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Fetcher } from '@/lib/fetcher';
import { showError } from '@/lib/toast';

/** ===== 공용 타입 ===== */
type SendMode = 'no-audio' | 'text-only' | 'with-uploads';

/** ===== 헬퍼: SpeechRecognition 생성자 안전 획득 ===== */
type SpeechRecognitionConstructor = new () => SpeechRecognition;
function getSpeechRecognitionCtor(): SpeechRecognitionConstructor | undefined {
  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
}

/** ===== 헬퍼: ImageCapture 생성자 안전 획득 ===== */
type ImageCaptureLike = { grabFrame: () => Promise<ImageBitmap> };
type ImageCaptureCtor = new (track: MediaStreamTrack) => ImageCaptureLike;
function getImageCaptureCtor(): ImageCaptureCtor | null {
  // 일부 브라우저만 제공
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyWin = window as any;
  return typeof anyWin.ImageCapture === 'function'
    ? (anyWin.ImageCapture as ImageCaptureCtor)
    : null;
}

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
  /** ===== refs ===== */
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const recognizedTextRef = useRef('');
  const subjectIdRef = useRef(subjectId);

  const answerSentRef = useRef(false);
  const pendingUploadsRef = useRef<string[]>([]);
  const postedSetRef = useRef<Set<string>>(new Set());

  const isRecognitionFinishedRef = useRef(false);
  const videoBlobRef = useRef<Blob | null>(null);

  // 정지 후 블랙 썸네일 방지: stop 전에 사전 캡처한 Blob 보관
  const thumbnailBlobRef = useRef<Blob | null>(null);

  // 말 멈춤 감지 타이머
  const speechTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** ===== state ===== */
  const [isRecording, setIsRecording] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isWaitingForAI, setIsWaitingForAI] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(true);

  /** ===== 카메라 미리 켜기 (On Mount) ===== */
  const setupCamera = useCallback(async () => {
    if (mediaStreamRef.current) {
      setIsCameraLoading(false);
      return; // 이미 스트림이 있으면 중복 실행 방지
    }

    setIsCameraLoading(true);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      mediaStreamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch(() => {});
      }
      setIsCameraLoading(false); // ✅ [추가] 성공 시 로딩 해제
    } catch (err) {
      console.error('❌ 카메라/마이크 시작 실패:', err);
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
              '카메라를 시작하는 중 문제가 발생했습니다. 페이지를 새로고침 해주세요.',
            );
            break;
        }
      }
      setIsCameraLoading(false);
    }
  }, []); // showError는 stable하므로 의존성 배열 비워둠

  /** ===== 마운트 시 카메라 셋업 ===== */
  useEffect(() => {
    setupCamera();
  }, [setupCamera]);

  /** ===== 언마운트 시 스트림 정리 ===== */
  useEffect(() => {
    return () => {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  /** ===== subjectId 최신화 ===== */
  useEffect(() => {
    subjectIdRef.current = subjectId;
  }, [subjectId]);

  /** ===== 역할 교대: 캐릭터가 말하지 않으면 버튼 대기 해제 ===== */
  useEffect(() => {
    if (!isCharacterSpeaking) setIsWaitingForAI(false);
  }, [isCharacterSpeaking]);

  /** ===== /uploaded 통지 ===== */
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

  /** ===== 썸네일 사전 캡처: ImageCapture → Canvas 폴백 ===== */
  const captureFrameToBlob = useCallback(async (): Promise<Blob | null> => {
    try {
      const v = videoRef.current;
      const c = canvasRef.current;
      if (!v || !c) return null;

      // 1) ImageCapture 우선
      const ctor = getImageCaptureCtor();
      if (ctor) {
        const stream = v.srcObject as MediaStream | null;
        const track = stream?.getVideoTracks?.()[0];
        if (track) {
          try {
            const ic = new ctor(track);
            const bitmap = await ic.grabFrame();
            c.width = bitmap.width;
            c.height = bitmap.height;
            const ctx = c.getContext('2d');
            ctx?.drawImage(bitmap, 0, 0);
            return await new Promise<Blob | null>((resolve) =>
              c.toBlob(resolve, 'image/jpeg', 0.92),
            );
          } catch {
            // 실패 시 폴백
          }
        }
      }

      // 2) Canvas 폴백: 메타데이터/페인트 보장 후 그리기
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
        c.toBlob(resolve, 'image/jpeg', 0.92),
      );
    } catch {
      return null;
    }
  }, []);

  /** ===== 업로드: 썸네일(사전 캡처 Blob만 사용) ===== */
  const captureAndUploadThumbnail = useCallback(async () => {
    const currentSubjectId = subjectIdRef.current;
    if (!currentSubjectId || !childId) return;

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
  }, [childId, postUploaded]);

  /** ===== 업로드: 비디오 ===== */
  const uploadVideo = useCallback(
    async (blob: Blob, type: 'video') => {
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
      const contentType = (blob.type || 'application/octet-stream').split(
        ';',
      )[0];

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
    },
    [childId, postUploaded],
  );

  /** ===== 제출 흐름 ===== */
  const sendAnswer = useCallback(
    async ({ mode }: { mode: SendMode }) => {
      setIsWaitingForAI(true);

      const currentRecognizedText = recognizedTextRef.current.trim();
      const currentSubjectId = subjectIdRef.current;

      if (!currentSubjectId || !childId) {
        setIsWaitingForAI(false);
        return;
      }

      // 텍스트 없음: 업로드 전부 금지 + 프론트 문구만
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
        setIsWaitingForAI(false);
        return;
      }

      // 서버 답변 요청
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
            // text-only: 업로드 금지
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
    [
      childId,
      onAIResponse,
      onFinished,
      postUploaded,
      uploadVideo,
      captureAndUploadThumbnail,
    ],
  );

  const processFinalSubmission = useCallback(async () => {
    const hasText = !!recognizedTextRef.current.trim();
    const hasVideo = !!videoBlobRef.current;

    if (!hasText) {
      await sendAnswer({ mode: 'no-audio' });
      return;
    }
    if (hasVideo) {
      await sendAnswer({ mode: 'with-uploads' });
    } else {
      await sendAnswer({ mode: 'text-only' });
    }
  }, [sendAnswer]);

  /** ===== STT ===== */
  const startSTT = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      showError('이 브라우저는 음성 인식을 지원하지 않습니다.');
      return;
    }
    const recognition = new Ctor();
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
  }, [processFinalSubmission]);

  /** ===== 녹화 제어 ===== */
  const startRecording = useCallback(async () => {
    // 스트림이 없으면 셋업 재시도
    if (!mediaStreamRef.current) {
      await setupCamera();
      if (!mediaStreamRef.current) {
        console.error(
          '⚠️ 미디어 스트림을 가져올 수 없어 녹화를 시작할 수 없습니다.',
        );
        return;
      }
    }

    // 이미 녹화 중이거나 시작 중이면 중단
    if (isRecording || isStarting || mediaRecorderRef.current) return;

    setIsStarting(true);
    setIsUserSpeaking(false);
    isRecognitionFinishedRef.current = false;
    videoBlobRef.current = null;
    thumbnailBlobRef.current = null;

    try {
      console.log('🎬 녹화 시작 요청됨');
      const mediaStream = mediaStreamRef.current; // 미리 켜둔 스트림 사용

      recognizedTextRef.current = '';
      answerSentRef.current = false;
      pendingUploadsRef.current = [];
      postedSetRef.current.clear();

      const chunks: BlobPart[] = [];
      const preferred = 'video/webm;codecs=vp9,opus';
      const fallback = 'video/webm;codecs=vp8,opus';
      const selected =
        typeof MediaRecorder !== 'undefined' &&
        typeof MediaRecorder.isTypeSupported === 'function' &&
        MediaRecorder.isTypeSupported(preferred)
          ? preferred
          : typeof MediaRecorder !== 'undefined' &&
              typeof MediaRecorder.isTypeSupported === 'function' &&
              MediaRecorder.isTypeSupported(fallback)
            ? fallback
            : 'video/webm';

      const recorder = new MediaRecorder(mediaStream, { mimeType: selected });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      recorder.onstop = async () => {
        console.log('🛑 [MediaRecorder] 녹화 종료됨');
        mediaRecorderRef.current = null;

        // Blob 생성 & 보관
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
      // [수정] 권한 오류는 setupCamera에서 처리되므로, 여기서는 MediaRecorder 오류만 처리
      console.error('❌ 녹화 시작 실패 (MediaRecorder):', err);
      showError(
        '녹화를 시작하는 중 문제가 발생했습니다. 페이지를 새로고침 해주세요.',
      );
    } finally {
      setIsStarting(false);
    }
  }, [
    isRecording,
    isStarting,
    processFinalSubmission,
    startSTT,
    setupCamera, // setupCamera 의존성 추가
  ]);

  const stopRecording = useCallback(async () => {
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

    recognitionRef.current?.stop();
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);

    setIsRecording(false);
    setIsUserSpeaking(false);
  }, [captureFrameToBlob]);

  /** ===== 디버깅: 버튼 비활성 이유 로그 ===== */
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

  /** ===== UI ===== */
  return (
    // 1. 최상위 래퍼: 'relative'만 적용 (버튼 기준점)
    <div className="relative w-full h-full">
      {/* 2. 내부 컨테이너: 비디오/오버레이를 둥글게 자르기 (overflow-hidden)
       */}
      <div
        className={`relative flex flex-col justify-center items-center 
                    w-full h-full bg-black rounded-full 
                    border-4 ${isUserSpeaking ? 'border-orange-400 animate-pulse' : 'border-orange-500'} 
                    shadow-2xl transition-all duration-300
                    overflow-hidden // 비디오와 오버레이를 잘라냄
                  `}
      >
        {/* ==============================================
        1. 비디오 및 캔버스 (항상 켜짐)
        =============================================== */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover" // 'hidden' 클래스 제거
          autoPlay
          muted
          playsInline
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* ==============================================
        2. 오버레이 + 안내 문구 (✅ 수정됨)
        =============================================== */}
        <div
          className={`absolute inset-0 bg-black 
                      transition-opacity duration-300
                      flex flex-col justify-center items-center
                      ${
                        isCameraLoading
                          ? 'opacity-100' // 로딩 중: 100% 불투명
                          : isRecording
                            ? 'opacity-0' // 녹화 중: 투명
                            : 'opacity-50' // 대기 중: 70% 불투명
                      } 
                    `}
        >
          {isCameraLoading ? (
            // (A) 카메라 로딩 중일 때
            <div className="text-white text-center px-10">
              {/* Tailwind 스피너 예시 */}
              <svg
                className="animate-spin h-10 w-10 text-white mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <strong className="text-2xl font-bold mt-4 block">
                카메라 켜는 중...
              </strong>
              <p className="text-lg opacity-80 mt-1">권한을 허용해주세요</p>
            </div>
          ) : (
            // (B) 카메라 로딩 완료 후 (기존 로직)
            <div
              className={`text-white text-center px-10 transition-opacity duration-300
                          ${isRecording ? 'opacity-0' : 'opacity-100'}
                        `}
            >
              <strong className="text-3xl font-bold">{feedbackText}</strong>
            </div>
          )}
        </div>
      </div>{' '}
      {/* <-- 비디오/오버레이 컨테이너 종료 */}
      {/* ==============================================
      3. 녹음 버튼 (✅ 수정됨: disabled, title)
      =============================================== */}
      <div className="absolute bottom-4 right-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            // ✅ [수정] 카메라 로딩 중에도 비활성화
            disabled={
              isCharacterSpeaking ||
              isStarting ||
              isWaitingForAI ||
              isCameraLoading
            }
            className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center
                       shadow-lg transition-all 
                       hover:scale-105 active:scale-95
                       disabled:bg-grayscale-gray30 disabled:opacity-70 disabled:scale-100"
            // ✅ [수정] 로딩 상태일 때 title 변경
            title={
              isCameraLoading ? '카메라 준비 중' : disabledReason || '녹음 시작'
            }
          >
            {/* Mic Icon (SVG ... ) */}
            <svg
              width="40"
              height="40"
              viewBox="25 25 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M45 26.6699C43.6739 26.6699 42.4021 27.1967 41.4645 28.1344C40.5268 29.0721 40 30.3438 40 31.6699V45.0033C40 46.3293 40.5268 47.6011 41.4645 48.5388C42.4021 49.4765 43.6739 50.0033 45 50.0033C46.3261 50.0033 47.5979 49.4765 48.5355 48.5388C49.4732 47.6011 50 46.3293 50 45.0033V31.6699C50 30.3438 49.4732 29.0721 48.5355 28.1344C47.5979 27.1967 46.3261 26.6699 45 26.6699Z"
                fill="#FF6B31"
                stroke="#FF6B31"
                strokeWidth="3.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M56.6673 41.668V45.0013C56.6673 48.0955 55.4382 51.063 53.2502 53.2509C51.0623 55.4388 48.0948 56.668 45.0007 56.668C41.9065 56.668 38.939 55.4388 36.7511 53.2509C34.5631 51.063 33.334 48.0955 33.334 45.0013V41.668"
                stroke="#FF6B31"
                strokeWidth="3.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M45 56.668V63.3346"
                stroke="#FF6B31"
                strokeWidth="3.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M38.334 63.3301H51.6673"
                stroke="#FF6B31"
                strokeWidth="3.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center
                     shadow-lg transition-all animate-pulse
                     hover:scale-105 active:scale-95"
            title="녹음 종료"
          >
            {/* Stop Icon (SVG ... ) */}
            <svg
              width="90"
              height="90"
              viewBox="0 0 90 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="90" height="90" rx="45" fill="white" />
              <rect
                x="31"
                y="31"
                width="28"
                height="28"
                rx="6"
                fill="#FF6B31"
              />
            </svg>
          </button>
        )}
      </div>
    </div> // <-- (A) 최상위 래퍼 div 종료
  );
}
