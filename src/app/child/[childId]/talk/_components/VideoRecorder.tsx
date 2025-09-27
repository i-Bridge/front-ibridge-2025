'use client';

import { useCallback, useRef, useState } from 'react';
import { Fetcher } from '@/lib/fetcher';
import { showError } from '@/lib/toast';

export default function VideoRecorder({
  childId,
  subjectId,
  onAIResponse,
  onFinished, //녹화가 종료됨
  onConversationFinished, //한 주제에 대한 대화가 종료됨
}: {
  childId: string;
  subjectId: number | null;
  onAIResponse: (message: string, isFinished: boolean) => void;
  onFinished: () => void;
  onConversationFinished: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const answerSentRef = useRef(false);
  const pendingUploadsRef = useRef<string[]>([]);
  // 같은 파일 URL을 중복으로 /uploaded에 보내지 않도록 막는 Set
  const postedSetRef = useRef<Set<string>>(new Set());
  // ✅ [수정] UI용 state를 제거하고, 데이터 처리용 ref만 남깁니다.
  const recognizedTextRef = useRef('');

  const [isRecording, setIsRecording] = useState(false); // const [recognizedText, setRecognizedText] = useState('');
  // ❌ [제거] UI와 연결된 useState를 완전히 제거합니다.
  const sendAnswer = useCallback(async () => {
    const currentRecognizedText = recognizedTextRef.current;

    if (!currentRecognizedText || !subjectId || !childId) {
      console.log('⚠️ 조건 부족으로 /answer 호출 생략', {
        currentRecognizedText,
        subjectId,
        childId,
      });
      return;
    }
    console.log('✉️ 텍스트만 /answer로 전송:', currentRecognizedText);
    const { data, isSuccess } = await Fetcher<{
      finished: boolean;
      ai: string;
    }>(`/child/${childId}/answer`, {
      method: 'POST',
      data: { subjectId, text: currentRecognizedText },
    });

    if (isSuccess && data) {
      console.log('✅ /answer 응답:', data);
      onAIResponse(data.ai, data.finished);

      if (data.finished) {
        onConversationFinished();
      }

      onFinished();
      answerSentRef.current = true;

      // 대기 중인 업로드 flush
      for (const url of pendingUploadsRef.current) {
        await postUploaded(url);
      }
      pendingUploadsRef.current = [];
    } else {
      console.error('❌ /answer 실패');
    }
  }, [childId, subjectId, onAIResponse, onConversationFinished, onFinished]);

  const postUploaded = async (fileUrl: string | null) => {
    if (!fileUrl || !subjectId || !childId) {
      console.log('⚠️ /uploaded 전송 조건 불충족', {
        fileUrl,
        subjectId,
        childId,
      });
      return;
    }
    if (!answerSentRef.current) {
      console.log('⏸ /answer 대기중 → 업로드 보류:', fileUrl);
      pendingUploadsRef.current.push(fileUrl);
      return;
    }
    if (postedSetRef.current.has(fileUrl)) {
      console.log('🚫 중복 /uploaded 스킵 (이미 전송된 URL):', fileUrl);
      return;
    }
    try {
      console.log('📤 /uploaded 전송:', { subjectId, file: fileUrl });
      await Fetcher(`/child/${childId}/uploaded`, {
        method: 'POST',
        data: { subjectId, file: fileUrl },
      });
      postedSetRef.current.add(fileUrl);
      console.log('✅ 백엔드에 업로드 완료(/uploaded):', fileUrl);
    } catch (err) {
      console.error('❌ /uploaded 실패', err);
    }
  };

  const startRecording = async () => {
    if (isRecording || mediaRecorderRef.current) return;
    try {
      console.log('🎬 녹화 시작 요청됨');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      // ✅ [수정] ref만 초기화합니다.
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
    }
  };

  const stopRecording = () => {
    console.log('🛑 녹화/음성인식 종료 신호 보냄');
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleRecognitionEnd = useCallback(async () => {
    console.log(
      '🏁 [SpeechRecognition] 완전히 종료됨. 이제 답변을 전송합니다.',
    );
    await sendAnswer();
  }, [sendAnswer]);

  const startSTT = () => {
    console.log('🎤 음성 인식 시작');
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
        console.log('📝 확정 텍스트 추가:', finalTranscript);
        // ✅ [수정] ref의 값을 직접 업데이트합니다.
        recognizedTextRef.current += finalTranscript + ' ';
      }
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      console.error('🎤 음성 인식 오류:', e);
    };

    // ✅ [수정] 'onend'가 표준 타입에 없어 TypeScript 오류가 발생할 수 있으므로, 'as any'로 타입 단언을 추가합니다.
    (recognition as any).onend = handleRecognitionEnd;

    recognitionRef.current = recognition;
    recognition.start();
  };

  const captureAndUploadThumbnail = async () => {
    if (!videoRef.current || !canvasRef.current || !subjectId) {
      console.warn('⚠️ 썸네일 캡처 불가: video/canvas/subjectId 부족', {
        video: !!videoRef.current,
        canvas: !!canvasRef.current,
        subjectId,
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
          data: { type: 'image', subjectId },
          skipAuthHeader: true,
        },
      );

      if (!data?.url) return console.error('❌ 썸네일 URL 획득 실패');

      const res = await fetch(data.url, {
        method: 'PUT',
        body: blob,
      });

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
    if (!subjectId || !childId) return;
    const { data } = await Fetcher<{ url: string }>(
      `/child/${childId}/getURL`,
      {
        method: 'POST',
        data: { type, subjectId },
        skipAuthHeader: true,
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

      // 🔹 영상 업로드 후 즉시 /uploaded 전송
      await postUploaded(s3Url);
    } else {
      console.error(`❌ ${type} 업로드 실패`);
    }
  };

  return (
    <div
      className="flex flex-col items-center min-w-[300px] max-w-[400px] gap-4 p-10 pr-14 bg-contain bg-center bg-no-repeat "
      style={{
        backgroundImage: `url('/images/영상박스_점선.png')`,
      }}
    >
      <video
        ref={videoRef}
        className="w-80 h-60 bg-black rounded shadow-sm mt-4"
        autoPlay
        muted
      />
      <canvas ref={canvasRef} className="hidden" />

      <div className="text-gray-700 w-80 p-2 bg-orange-200 rounded shadow-sm text-sm">
        <strong>🎙️버튼을 눌러 말해보세요!</strong>{' '}
      </div>

      {!isRecording ? (
        <button
          onClick={startRecording}
          className="p-4 bg-i-lightgreen text-white rounded-full shadow-sm hover:scale-105 transition-transform"
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
