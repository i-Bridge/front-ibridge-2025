'use client';

import { useRef, useState, useEffect } from 'react';
import { usePresignedUrl } from '@/hooks/s3/usePresignedUrl';
import { useParams } from 'next/navigation';

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
  const [recognizedText, setRecognizedText] = useState('');

  const [answerId, setAnswerId] = useState<number | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  const { childId } = useParams();
  const { getPresignedUrl } = usePresignedUrl();

  const startRecording = async () => {
    if (mediaRecorderRef.current) return;

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      setIsThumbnailCaptured(false);
      setRecognizedText('');
      setAnswerId(null);
      setVideoUrl(null);
      setThumbnailUrl(null);

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

        // 👉 presigned URL 요청 및 업로드
        if (!answerId) return;
        const presigned = await getPresignedUrl('video', answerId);
        if (!presigned) return;
        await fetch(presigned, { method: 'PUT', body: blob });
        setVideoUrl(presigned.split('?')[0]);

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
      console.error('녹화 실패:', err);
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
      console.error('음성 인식 오류:', e);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopSTT = () => {
    recognitionRef.current?.stop();
  };

  const captureAndUploadThumbnail = async () => {
    if (!videoRef.current || !canvasRef.current || !answerId) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const presigned = await getPresignedUrl('image', answerId);
      if (!presigned) return;
      await fetch(presigned, { method: 'PUT', body: blob });
      setThumbnailUrl(presigned.split('?')[0]);
    }, 'image/jpeg');
  };

  useEffect(() => {
    const sendAnswer = async () => {
      if (
        !answerId &&
        recognizedText.trim().length > 0 &&
        !isRecording &&
        childId
      ) {
        const res = await fetch(`/child/${childId}/answer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subjectId, text: recognizedText }),
        });
        const json = await res.json();
        if (json?.data?.id) {
          setAnswerId(json.data.id);
          onAIResponse(json.data.ai);
        }
      }
    };
    sendAnswer();
  }, [recognizedText, isRecording]);

  useEffect(() => {
    const notifyUploadComplete = async () => {
      if (videoUrl && thumbnailUrl && answerId && childId) {
        await fetch(`/child/${childId}/uploaded`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: answerId,
            video: videoUrl,
            image: thumbnailUrl,
          }),
        });
      }
    };
    notifyUploadComplete();
  }, [videoUrl, thumbnailUrl, answerId]);

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
