'use client';

import { useRef, useState } from 'react';
import { Fetcher } from '@/lib/fetcher';
import { usePresignedUrl } from '@/hooks/s3/usePresignedUrl';

export default function VideoRecorder() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isThumbnailCaptured, setIsThumbnailCaptured] = useState(false);

  const { getPresignedUrl } = usePresignedUrl();

  const startRecording = async () => {
    if (mediaRecorderRef.current) {
      console.warn('이미 녹화 중입니다.');
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      setIsThumbnailCaptured(false);

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
        await uploadToS3(blob);
        mediaStream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);

      setTimeout(() => {
        if (!isThumbnailCaptured) {
          captureAndUploadThumbnail();
          setIsThumbnailCaptured(true);
        }
      }, 3000);
    } catch (err) {
      console.error('녹화 시작 실패:', err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
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
      if (!blob) return;

      const url = await getPresignedUrl();
      if (!url) return;

      try {
        const res = await fetch(url, {
          method: 'PUT',
          body: blob,
        });

        if (!res.ok) throw new Error('썸네일 S3 업로드 실패');
        console.log('✅ 썸네일 업로드 완료:', url);

        await Fetcher('/save-thumbnail-url', {
          method: 'POST',
          data: { url },
        });
      } catch (err) {
        console.error('썸네일 업로드 실패:', err);
      }
    }, 'image/jpeg');
  };

  const uploadToS3 = async (blob: Blob) => {
    const url = await getPresignedUrl();
    if (!url) return;

    try {
      const res = await fetch(url, {
        method: 'PUT',
        body: blob,
      });

      if (!res.ok) {
        throw new Error('S3 업로드 실패');
      }

      console.log('✅ 영상 업로드 완료:', url);

      await Fetcher('/save-video-url', {
        method: 'POST',
        data: { url },
      });
    } catch (err) {
      console.error('🎥 업로드 실패:', err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <video ref={videoRef} className="w-80 h-60 bg-black rounded" />
      <canvas ref={canvasRef} className="hidden" />
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
