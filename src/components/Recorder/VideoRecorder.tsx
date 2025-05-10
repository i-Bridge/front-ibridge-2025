'use client';

import { useRef, useState, useEffect } from 'react';
import { usePresignedUrl } from '@/hooks/s3/usePresignedUrl';
import { useAnswerAI } from '@/hooks/chat/useAnswerAI';

export default function VideoRecorder() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isThumbnailCaptured, setIsThumbnailCaptured] = useState(false);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState<
    string | null
  >(null);

  const { getPresignedUrl } = usePresignedUrl();
  const { postAnswer } = useAnswerAI();

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

        setUploadedThumbnailUrl(url);
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
        throw new Error('영상 S3 업로드 실패');
      }

      console.log('✅ 영상 업로드 완료:', url);
      setUploadedVideoUrl(url);
    } catch (err) {
      console.error('🎥 영상 업로드 실패:', err);
    }
  };

  // 영상과 썸네일 업로드가 모두 끝나면 백엔드에 전송
  useEffect(() => {
    const sendToBackend = async () => {
      if (uploadedVideoUrl && uploadedThumbnailUrl && !isRecording) {
        const aiResponse = await postAnswer({
          isFinished: false,
          video: uploadedVideoUrl,
          thumbnail: uploadedThumbnailUrl,
        });

        if (aiResponse) {
          console.log('🤖 GPT 응답:', aiResponse);
          // TODO: aiResponse로 다음 질문 표시 or TTS 연결
        }
      }
    };

    sendToBackend();
  }, [uploadedVideoUrl, uploadedThumbnailUrl, isRecording]);

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
