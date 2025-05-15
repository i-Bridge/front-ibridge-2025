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
      console.log('🎬 녹화 시작 요청됨');
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
        console.log('🛑 녹화 종료됨 → 영상 업로드 시작');
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
          console.log('📸 3초 경과 → 썸네일 캡처 시도');
          captureAndUploadThumbnail();
          setIsThumbnailCaptured(true);
        }
      }, 3000);
    } catch (err) {
      console.error('❌ 녹화 시작 실패:', err);
    }
  };

  const stopRecording = () => {
    console.log('🛑 녹화 중지 요청됨');
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
    console.log('🛑 음성 인식 중단');
    recognitionRef.current?.stop();
  };

  const captureAndUploadThumbnail = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    console.log('🖼 썸네일 캡처 중...');
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    canvas.toBlob(async (blob) => {
      if (!blob || !answerId) return;

      console.log('☁️ 썸네일 Presigned URL 요청');
      const { data } = await Fetcher<{ url: string }>(
        `/child/${childId}/getURL`,
        {
          method: 'POST',
          data: { type: 'image', id: answerId },
          skipAuthHeader: true,
        },
      );

      if (!data?.url) {
        console.error('❌ 썸네일 Presigned URL 획득 실패');
        return;
      }

      const res = await fetch(data.url, { method: 'PUT', body: blob });
      if (res.ok) {
        const s3Url = data.url.split('?')[0];
        console.log('✅ 썸네일 S3 업로드 완료:', s3Url);
        setUploadedThumbnailUrl(s3Url);
      } else {
        console.error('❌ 썸네일 S3 업로드 실패');
      }
    }, 'image/jpeg');
  };

  const uploadToS3 = async (blob: Blob, type: 'video') => {
    if (!answerId) return;

    console.log('☁️ 영상 Presigned URL 요청');
    const { data } = await Fetcher<{ url: string }>(
      `/child/${childId}/getURL`,
      {
        method: 'POST',
        data: { type: 'video', id: answerId },
        skipAuthHeader: true,
      },
    );

    if (!data?.url) {
      console.error('❌ 영상 Presigned URL 획득 실패');
      return;
    }

    const res = await fetch(data.url, { method: 'PUT', body: blob });
    if (res.ok) {
      const s3Url = data.url.split('?')[0];
      console.log('✅ 영상 S3 업로드 완료:', s3Url);
      setUploadedVideoUrl(s3Url);
    } else {
      console.error('❌ 영상 S3 업로드 실패');
    }
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
        console.log('📤 백엔드로 전송 시작');
        console.log('📝 전송할 텍스트:', recognizedText);
        console.log('🎯 subjectId:', subjectId);

        const { data, isSuccess } = await Fetcher<{
          id: number;
          ai: string;
        }>(`/child/${childId}/answer`, {
          method: 'POST',
          data: { subjectId, text: recognizedText },
        });
        console.log('📥 /answer API 응답:', { isSuccess, data });
        if (isSuccess && data) {
          console.log('✅ 텍스트 응답 저장 완료. answerId:', data.id);
          setAnswerId(data.id);
          onAIResponse(data.ai);
          console.log('📤 S3 업로드 완료 알림 전송 시작');
          const uploadRes = await Fetcher(`/child/${childId}/uploaded`, {
            method: 'POST',
            data: {
              id: data.id,
              video: uploadedVideoUrl,
              image: uploadedThumbnailUrl,
            },
          });

          if (uploadRes.isSuccess) {
            console.log('✅ 백엔드에 업로드 완료 알림 전송 성공');
          } else {
            console.warn('⚠️ 업로드 완료 알림 실패');
          }
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
