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
      console.warn('⚠️ 이미 녹화 중입니다.');
      return;
    }

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
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      console.log('✅ 녹화가 시작되었습니다.');

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
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    console.log('🛑 녹화 중지 요청됨');
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
      if (!blob) {
        console.error('❌ 썸네일 Blob 생성 실패');
        return;
      }

      console.log('☁️ Presigned URL 요청 중 (썸네일)');
      const url = await getPresignedUrl('thumbnail');
      if (!url) return;

      try {
        const res = await fetch(url, {
          method: 'PUT',
          body: blob,
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error('❌ 썸네일 S3 업로드 실패 본문:', errorText);
          throw new Error('썸네일 S3 업로드 실패');
        }

        console.log('✅ 썸네일 업로드 완료');
        setUploadedThumbnailUrl(url.split('?')[0]);
      } catch (err) {
        console.error('❌ 썸네일 업로드 실패:', err);
      }
    }, 'image/jpeg');
  };

  const uploadToS3 = async (blob: Blob, type: 'video') => {
    console.log(`☁️ Presigned URL 요청 중 (${type})`);
    const url = await getPresignedUrl(type);
    if (!url) return;

    try {
      const res = await fetch(url, {
        method: 'PUT',
        body: blob,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`❌ ${type} S3 업로드 실패 본문:`, errorText);
        throw new Error(`${type} S3 업로드 실패`);
      }

      console.log(`✅ ${type} 업로드 완료`);
      setUploadedVideoUrl(url.split('?')[0]);
    } catch (err) {
      console.error(`❌ ${type} 업로드 실패:`, err);
    }
  };

  useEffect(() => {
    const sendToBackend = async () => {
      if (uploadedVideoUrl && uploadedThumbnailUrl && !isRecording) {
        console.log('🚀 영상 & 썸네일 업로드 완료 → GPT 질문 요청 시작');
        const aiResponse = await postAnswer({
          isFinished: false,
          video: uploadedVideoUrl,
          thumbnail: uploadedThumbnailUrl,
        });

        if (aiResponse) {
          console.log('🤖 GPT 응답 성공:', aiResponse);
        } else {
          console.warn('⚠️ GPT 응답 실패');
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
