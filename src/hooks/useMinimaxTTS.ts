import { useRef, useState, useCallback } from 'react';

export function useMinimaxTTS() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback(
    async (text: string, opts?: { speed?: number; pitch?: number }) => {
      if (!text) return;

      try {
        console.log('🔊 MiniMax TTS 요청:', { text, opts });

        setIsSpeaking(true);

        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            speed: opts?.speed ?? 1.0,
            pitch: opts?.pitch ?? 1.0,
          }),
        });

        if (!res.ok) {
          console.warn('⚠️ MiniMax TTS 실패 → Web Speech로 폴백');
          const utt = new SpeechSynthesisUtterance(text);
          utt.lang = 'ko-KR';
          utt.pitch = 1.4;
          utt.rate = 0.8;
          utt.onend = () => setIsSpeaking(false);
          window.speechSynthesis.speak(utt);
          return;
        }

        const blob = await res.blob();
        console.log(
          '🎧 /api/tts Content-Type:',
          res.headers.get('content-type'),
        );
        const url = URL.createObjectURL(blob);

        // 기존 오디오 정리
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = '';
        }

        const audio = new Audio();
        audioRef.current = audio;

        // iOS 자동재생 정책 대응: 사용자 제스처 이후 재생이 안정적
        audio.src = url;
        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(url);
        };
        audio.onerror = () => {
          console.error('❌ 오디오 재생 오류');
          setIsSpeaking(false);
          URL.revokeObjectURL(url);
        };

        await audio.play();
      } catch (err) {
        console.error('❌ MiniMax TTS 에러:', err);
        setIsSpeaking(false);
      }
    },
    [],
  );

  const cancel = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  return { speak, cancel, isSpeaking };
}
