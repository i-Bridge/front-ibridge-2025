'use client';

import { useRef, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Fetcher } from '@/lib/fetcher';

export default function VideoRecorder({
  subjectId,
  onAIResponse,
}: {
  subjectId: number;
  onAIResponse: (message: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isThumbnailCaptured, setIsThumbnailCaptured] = useState(false);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState<
    string | null
  >(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [answerId, setAnswerId] = useState<number | null>(null);

  const { childId } = useParams();

  const startRecording = async () => {
    if (mediaRecorderRef.current) return;

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      setIsThumbnailCaptured(false);
      setUploadedVideoUrl(null);
      setUploadedThumbnailUrl(null);
      setRecognizedText('');
      setAnswerId(null);

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
        const blob = new Blob(chunks, { type: 'video/webm' });
        await uploadToS3(blob, 'video');
        mediaStream.getTracks().forEach((track) => track.stop());
        stopSTT();
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      startSTT();

      setTimeout(() => {
        if (!isThumbnailCaptured) {
          captureAndUploadThumbnail();
          setIsThumbnailCaptured(true);
        }
      }, 3000);
    } catch (err) {
      console.error('❌ 녹화 시작 실패:', err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const startSTT = () => {
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
  };

  const captureAndUploadThumbnail = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    canvas.toBlob(async (blob) => {
      if (!blob || !answerId) return;

      const { data } = await Fetcher<{ url: string }>(
        `/child/${childId}/getURL`,
        {
          method: 'POST',
          data: { type: 'image', id: answerId },
          skipAuthHeader: true,
        },
      );

      if (!data?.url) return;

      const res = await fetch(data.url, { method: 'PUT', body: blob });
      if (res.ok) setUploadedThumbnailUrl(data.url.split('?')[0]);
    }, 'image/jpeg');
  };

  const uploadToS3 = async (blob: Blob, type: 'video') => {
    if (!answerId) return;

    const { data } = await Fetcher<{ url: string }>(
      `/child/${childId}/getURL`,
      {
        method: 'POST',
        data: { type: 'video', id: answerId },
        skipAuthHeader: true,
      },
    );

    if (!data?.url) return;

    const res = await fetch(data.url, { method: 'PUT', body: blob });
    if (res.ok) setUploadedVideoUrl(data.url.split('?')[0]);
  };

  useEffect(() => {
    const sendToBackend = async () => {
      if (
        uploadedVideoUrl &&
        uploadedThumbnailUrl &&
        !isRecording &&
        recognizedText &&
        childId &&
        subjectId
      ) {
        const { data, isSuccess } = await Fetcher<{
          id: number;
          ai: string;
        }>(`/child/${childId}/answer`, {
          method: 'POST',
          data: { subjectId, text: recognizedText },
        });

        if (isSuccess && data) {
          setAnswerId(data.id);
          onAIResponse(data.ai);

          // 업로드 완료 알림 전송
          await Fetcher(`/child/${childId}/uploaded`, {
            method: 'POST',
            data: {
              id: data.id,
              video: uploadedVideoUrl,
              image: uploadedThumbnailUrl,
            },
          });
        }
      }
    };

    sendToBackend();
  }, [uploadedVideoUrl, uploadedThumbnailUrl, isRecording]);

  return (
    <div className="flex flex-col items-center gap-4">
      <video ref={videoRef} className="w-80 h-60 bg-black rounded" />
      <canvas ref={canvasRef} className="hidden" />
      <div className="text-gray-700 w-80 p-2 bg-white rounded shadow-sm text-sm">
        <strong>📝 인식된 텍스트:</strong>{' '}
        {recognizedText || '말을 해보세요...'}
      </div>
      {!isRecording ? (
        <button
          onClick={startRecording}
          className="px-6 py-3 bg-green-500 text-white rounded-lg"
          disabled={isRecording}
        >
          녹화 시작
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="px-6 py-3 bg-red-500 text-white rounded-lg"
        >
          녹화 종료
        </button>
      )}
    </div>
  );
}
