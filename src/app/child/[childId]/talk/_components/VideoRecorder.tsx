'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { Fetcher } from '@/lib/fetcher';
import { showError } from '@/lib/toast';

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
  // ✅ [추가] 말 멈춤 감지를 위한 타이머의 ID를 저장할 ref입니다.
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    subjectIdRef.current = subjectId;
  }, [subjectId]);

  const [isRecording, setIsRecording] = useState(false);
  // 녹화 시작 프로세스가 진행 중인지 추적하는 상태. 더블클릭 방지용.
  const [isStarting, setIsStarting] = useState(false);
  const [isWaitingForAI, setIsWaitingForAI] = useState(true); // AI 응답 대기중
  const [isUserSpeaking, setIsUserSpeaking] = useState(false); // 사용자 말하는 중

  useEffect(() => {
    // 이 로직은 버튼 비활성화 상태를 끊김 없이 유지하기 위한 "역할 교대"를 담당합니다.
    // 1. (사용자 녹음 종료 후) isWaitingForAI가 true가 되어 버튼이 비활성화됩니다.
    // 2. (AI 응답 도착 후) isCharacterSpeaking이 true가 되는 순간,
    //    이제 버튼 비활성화의 책임이 isCharacterSpeaking에게 넘어갑니다.
    // 3. 따라서 isWaitingForAI는 false로 바꿔주어, 나중에 isCharacterSpeaking이
    //    false가 되었을 때 버튼이 정상적으로 활성화될 수 있도록 준비합니다.
    if (isCharacterSpeaking && isWaitingForAI) {
      setIsWaitingForAI(false);
    }
  }, [isCharacterSpeaking, isWaitingForAI]);

  const sendAnswer = useCallback(async () => {
    // 답변 전송을 시작하면, 'AI 응답 대기 중' 상태로 만들어 버튼을 비활성화합니다.
    setIsWaitingForAI(true);

    const currentRecognizedText = recognizedTextRef.current.trim();
    const currentSubjectId = subjectIdRef.current;

    // 1. subjectId나 childId가 없으면 여전히 전송을 막습니다.
    if (!currentSubjectId || !childId) {
      console.log(
        '⚠️ 조건 부족으로 /answer 호출 생략 (subjectId 또는 childId 없음)',
      );
      return;
    }

    // 2. 인식된 텍스트가 없을 경우, AI에게 보낼 특별한 신호를 정의합니다.
    // 이 신호는 백엔드에서 해석하여 적절한 프롬프트를 생성하는 데 사용됩니다.
    const textToSend = currentRecognizedText || '[NO_AUDIO_INPUT]';

    console.log('✉️ 텍스트를 /answer로 전송:', textToSend);
    const { data, isSuccess } = await Fetcher<{
      finished: boolean;
      ai: string;
    }>(`/child/${childId}/answer`, {
      method: 'POST',
      // 3. 백엔드에는 'subjectId'와 'text' key를 사용하여 데이터를 보냅니다.
      data: { subjectId: currentSubjectId, text: textToSend },
    });

    if (isSuccess && data) {
      console.log('✅ /answer 응답:', data);
      onAIResponse(data.ai, data.finished);

      onFinished();
      answerSentRef.current = true;

      for (const url of pendingUploadsRef.current) {
        await postUploaded(url);
      }
      pendingUploadsRef.current = [];
    } else {
      console.error('❌ /answer 실패');
    }
  }, [childId, onAIResponse, onFinished]);

  const postUploaded = async (fileUrl: string | null) => {
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
    if (postedSetRef.current.has(fileUrl)) {
      return;
    }
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
  };

  const startRecording = async () => {
    // 이미 녹음 중이거나, '시작 중' 상태일 때는 아무것도 하지 않습니다.
    if (isRecording || isStarting || mediaRecorderRef.current) return;

    // 즉시 '시작 중' 상태로 만들어 버튼을 비활성화합니다.
    setIsStarting(true);
    // ✅ [추가] 녹화 시작 시, 사용자 음성 감지 상태를 초기화합니다.
    setIsUserSpeaking(false);

    try {
      console.log('🎬 녹화 시작 요청됨');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true, // ✅ [수정 2] 음성 인식을 위해 반드시 true로 설정해야 합니다.
      });
      recognizedTextRef.current = '';
      answerSentRef.current = false;
      pendingUploadsRef.current = [];
      postedSetRef.current.clear();

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      const chunks: BlobPart[] = [];
      const recorder = new MediaRecorder(mediaStream);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      recorder.onstop = async () => {
        console.log('🛑 [MediaRecorder] 녹화 종료됨');
        const blob = new Blob(chunks, { type: 'video/webm' });
        console.log('📦 영상 Blob 생성 완료, 업로드 시작');
        mediaStream.getTracks().forEach((track) => track.stop());
        mediaRecorderRef.current = null;

        await uploadVideo(blob, 'video');
        await captureAndUploadThumbnail();
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      console.log('🔴 녹화 시작됨');
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
  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    // 종료 시 타이머 제거
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }
    setIsRecording(false);
    // 종료 시 사용자 음성 감지 상태 해제
    setIsUserSpeaking(false);
  };

  const handleRecognitionEnd = useCallback(async () => {
    await sendAnswer();
  }, [sendAnswer]);

  const startSTT = () => {
    const SpeechRecognitionConstructor =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionConstructor) {
      showError('이 브라우저는 음성 인식을 지원하지 않습니다.');
      return;
    }
    const recognition: SpeechRecognition = new SpeechRecognitionConstructor();
    recognition.lang = 'ko-KR';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // 1. 이전 타이머가 있다면 초기화합니다.
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
      // 2. 음성 결과가 들어왔으므로, '말하는 중' 상태로 설정합니다.
      setIsUserSpeaking(true);

      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        recognizedTextRef.current += finalTranscript + ' ';
      }

      // 3.'말 멈춤'으로 간주하고 상태를 false로 바꾸는 새 타이머를 설정합니다.
      speechTimeoutRef.current = setTimeout(() => {
        console.log('🎤 사용자 말 멈춤 감지 (타임아웃)');
        setIsUserSpeaking(false);
      }, 1000);
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      console.error('🎤 음성 인식 오류:', e);
    };
    (recognition as any).onend = handleRecognitionEnd;
    recognitionRef.current = recognition;
    recognition.start();
  };

  const captureAndUploadThumbnail = async () => {
    const currentSubjectId = subjectIdRef.current;
    if (!videoRef.current || !canvasRef.current || !currentSubjectId) {
      console.warn('⚠️ 썸네일 캡처 불가: video/canvas/subjectId 부족', {
        video: !!videoRef.current,
        canvas: !!canvasRef.current,
        subjectId: currentSubjectId,
      });
      return;
    }
    console.log('🖼 썸네일 캡처 중...');
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      console.log('☁️ 썸네일 Presigned URL 요청');
      const { data } = await Fetcher<{ url: string }>(
        `/child/${childId}/getURL`,
        {
          method: 'POST',
          data: { type: 'image', subjectId: currentSubjectId },
        },
      );
      if (!data?.url) return console.error('❌ 썸네일 URL 획득 실패');
      const res = await fetch(data.url, { method: 'PUT', body: blob });
      if (res.ok) {
        const s3Url = data.url.split('?')[0];
        console.log('✅ 썸네일 S3 업로드 완료:', s3Url);
        await postUploaded(s3Url);
      } else {
        console.error('❌ 썸네일 업로드 실패');
      }
    }, 'image/jpeg');
  };

  const uploadVideo = async (blob: Blob, type: 'video') => {
    const currentSubjectId = subjectIdRef.current;
    if (!currentSubjectId || !childId) return;
    const { data } = await Fetcher<{ url: string }>(
      `/child/${childId}/getURL`,
      {
        method: 'POST',
        // ✅ [수정 1] API 요청 시 JSON key를 'subjectId'로 변경합니다.
        data: { type, subjectId: currentSubjectId },
        // skipAuthHeader: true,
      },
    );
    if (!data?.url) {
      console.error(`❌ ${type} URL 획득 실패`);
      return;
    }
    const res = await fetch(data.url, { method: 'PUT', body: blob });
    if (res.ok) {
      const s3Url = data.url.split('?')[0];
      console.log(`✅ ${type} S3 업로드 완료:`, s3Url);
      await postUploaded(s3Url);
    } else {
      console.error(`❌ ${type} 업로드 실패`);
    }
  };

  const feedbackText = isRecording
    ? isUserSpeaking
      ? '듣고 있어요...'
      : '지금 말씀해주세요!'
    : '버튼을 눌러 말해보세요!';

  return (
    <div
      className="flex flex-col items-center min-w-[300px] max-w-[400px] gap-4 p-10 pr-14 bg-contain bg-center bg-no-repeat "
      style={{ backgroundImage: `url('/images/영상박스_점선.png')` }}
    >
      {/* ✅ [수정] 비디오를 div로 감싸고, isUserSpeaking 상태에 따라 빛나는 효과를 추가합니다. */}
      <div
        className={`relative transition-all duration-300 rounded-lg ${isUserSpeaking ? 'ring-4 ring-green-400 ring-offset-2 animate-pulse' : ''}`}
      >
        <video
          ref={videoRef}
          className="w-80 h-60 bg-black rounded shadow-sm"
          autoPlay
          muted
        />
      </div>
      <canvas ref={canvasRef} className="hidden" />
      {/* 안내 텍스트를 동적인 feedbackText로 변경합니다. */} 
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
          title={
            isCharacterSpeaking
              ? '캐릭터가 말하는 중에는 녹음할 수 없어요.'
              : isStarting
                ? '녹화를 준비 중입니다...'
                : isWaitingForAI
                  ? 'AI가 응답을 준비 중입니다...'
                  : '녹음 시작'
          }
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
  );
}
