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
  useEffect(() => {
    subjectIdRef.current = subjectId;
  }, [subjectId]);

  const [isRecording, setIsRecording] = useState(false);
  // ✅ [추가] 녹화 시작 프로세스가 진행 중인지 추적하는 상태. 더블클릭 방지용.
  const [isStarting, setIsStarting] = useState(false);

  const sendAnswer = useCallback(async () => {
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
    } finally {
      // 모든 작업이 끝나면 (성공하든 실패하든) '시작 중' 상태를 해제합니다.
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
    setIsRecording(false);
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
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        recognizedTextRef.current += finalTranscript + ' ';
      }
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

  return (
    <div
      className="flex flex-col items-center min-w-[300px] max-w-[400px] gap-4 p-10 pr-14 bg-contain bg-center bg-no-repeat "
      style={{ backgroundImage: `url('/images/영상박스_점선.png')` }}
    >
      <video
        ref={videoRef}
        className="w-80 h-60 bg-black rounded shadow-sm mt-4"
        autoPlay
        muted
      />
      <canvas ref={canvasRef} className="hidden" /> 
      <div className="text-gray-700 w-80 p-2 bg-orange-200 rounded shadow-sm text-sm">
        <strong>🎙️버튼을 눌러 말해보세요!</strong>
      </div>
      {!isRecording ? (
        <button
          onClick={startRecording}
          disabled={isCharacterSpeaking || isStarting}
          className="p-4 bg-i-lightgreen text-white rounded-full shadow-sm hover:scale-105 transition-transform disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
          title={
            isCharacterSpeaking
              ? '캐릭터가 말하는 중에는 녹음할 수 없어요.'
              : isStarting
                ? '녹화를 준비 중입니다...'
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
