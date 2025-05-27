'use client';

import { useRef, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Fetcher } from '@/lib/fetcher';

export default function VideoRecorder({
  subjectId,
  onAIResponse,
  onFinished, //녹화가 종료됨
  onConversationFinished, //한 주제에 대한 대화가 종료됨
}: {
  subjectId: number | null;
  onAIResponse: (message: string) => void;
  onFinished: () => void;
  onConversationFinished: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState<
    string | null
  >(null);
  const [recognizedText, setRecognizedText] = useState('');

  const { childId } = useParams();

  useEffect(() => {
    const sendToBackend = async () => {
      if (
        uploadedVideoUrl &&
        uploadedThumbnailUrl &&
        recognizedText &&
        subjectId &&
        childId
      ) {
        console.log('📤 /answer 요청 시작');
        const { data, isSuccess } = await Fetcher<{
          finished: boolean;
          ai: string;
        }>(`/child/${childId}/answer`, {
          method: 'POST',
          data: { subjectId, text: recognizedText },
        });

        if (isSuccess && data) {
          console.log('✅ /answer 응답:', data);

          await Fetcher(`/child/${childId}/uploaded`, {
            method: 'POST',
            data: {
              subjectId,
              video: uploadedVideoUrl,
              image: uploadedThumbnailUrl,
            },
          });

          if (data.finished) {
            console.log('🏁 모든 질문 완료됨');
            const finalMessage = '수고했어! 내일 또 만나~';
            onAIResponse(finalMessage);
            const utterance = new SpeechSynthesisUtterance(finalMessage);
            utterance.lang = 'ko-KR';
            utterance.pitch = 1.4;
            utterance.rate = 0.8;
            window.speechSynthesis.speak(utterance);

            onConversationFinished();
            return;
          }

          onAIResponse(data.ai);
          onFinished();
        } else {
          console.error('❌ /answer 실패');
        }
      }
    };

    sendToBackend();
  }, [uploadedVideoUrl, uploadedThumbnailUrl, recognizedText]);

  const startRecording = async () => {
    if (mediaRecorderRef.current) return;

    try {
      console.log('🎬 녹화 시작 요청됨');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setRecognizedText('');
      setUploadedVideoUrl(null);
      setUploadedThumbnailUrl(null);

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
        console.log('🛑 녹화 종료됨');
        const blob = new Blob(chunks, { type: 'video/webm' });
        console.log('📦 영상 Blob 생성 완료, 업로드 시작');
        await uploadToS3(blob, 'video');
        mediaStream.getTracks().forEach((track) => track.stop());
        stopSTT();
        mediaRecorderRef.current = null;
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      console.log('🔴 녹화 시작됨');
      setIsRecording(true);
      startSTT();

      setTimeout(() => {
        captureAndUploadThumbnail();
      }, 1000);
    } catch (err) {
      console.error('❌ 녹화 시작 실패:', err);
    }
  };

  const stopRecording = () => {
    console.log('🛑 녹화 종료 버튼 클릭됨');
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const startSTT = () => {
    console.log('🎤 음성 인식 시작');
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        finalTranscript += event.results[i][0].transcript;
      }
      console.log('📝 인식된 텍스트:', finalTranscript);
      setRecognizedText(finalTranscript);
    };

    recognition.onerror = (e: any) => {
      console.error('🎤 음성 인식 오류:', e);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopSTT = () => {
    recognitionRef.current?.stop();
    console.log('🛑 음성 인식 종료');
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

      if (!data?.url) {
        console.error('❌ 썸네일 URL 획득 실패');
        return;
      }

      const res = await fetch(data.url, { method: 'PUT', body: blob });
      if (res.ok) {
        const s3Url = data.url.split('?')[0];
        console.log('✅ 썸네일 S3 업로드 완료:', s3Url);
        setUploadedThumbnailUrl(s3Url);
      } else {
        console.error('❌ 썸네일 업로드 실패');
      }
    }, 'image/jpeg');
  };

  const uploadToS3 = async (blob: Blob, type: 'video') => {
    if (!subjectId) return;

    console.log(`☁️ ${type} Presigned URL 요청`);
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
      setUploadedVideoUrl(s3Url);
    } else {
      console.error(`❌ ${type} 업로드 실패`);
    }
  };

  return (
    <div
      className="flex flex-col items-center gap-4 p-10 pr-14 bg-contain bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/images/영상박스.png')`,
      }}
    >
      <video
        ref={videoRef}
        className="w-80 h-60 bg-black rounded shadow-sm mt-4"
      />
      <canvas ref={canvasRef} className="hidden" />

      <div className="text-gray-700 w-80 p-2 bg-red-100 rounded shadow-sm text-sm">
        <strong>📝 인식된 텍스트:</strong>{' '}
        {recognizedText || '말을 해보세요...'}
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
          className="p-4 bg-red-300 text-white rounded-full shadow-sm hover:scale-105 transition-transform"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
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
