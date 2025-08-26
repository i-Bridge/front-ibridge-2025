// hooks/useMinimaxTTS.ts
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

type TTSSource = {
  buffer: AudioBuffer;
  dur: number;
};

export function useMinimaxTTS() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const cacheRef = useRef<Map<string, TTSSource>>(new Map());

  useEffect(() => {
    audioCtxRef.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
  }, []);

  const makeKey = (text: string, voice = 'default', speed = 1) =>
    `${voice}:${speed}:${text}`;

  // ✅ 선준비: 합성 + 디코딩까지 끝내 캐시에 AudioBuffer 저장
  const prepare = useCallback(
    async (text: string, opts?: { voice?: string; speed?: number }) => {
      const key = makeKey(text, opts?.voice, opts?.speed);
      if (cacheRef.current.has(key)) return key;

      // NOTE: 여기서 샘플레이트/비트레이트를 낮춰 응답을 더 가볍게 받을 수 있음(벤더 옵션 지원 시)
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          // vendor 옵션 예시(지원 시)
          voice: opts?.voice ?? 'default',
          speed: opts?.speed ?? 1,
          format: 'mp3',
          sampleRate: 24000,
          bitrateKbps: 64,
        }),
      });
      if (!res.ok) throw new Error('TTS fetch failed');

      const buf = await res.arrayBuffer();
      const ctx = audioCtxRef.current!;
      const audioBuffer = await ctx.decodeAudioData(buf);
      cacheRef.current.set(key, {
        buffer: audioBuffer,
        dur: audioBuffer.duration,
      });
      return key;
    },
    [],
  );

  const play = useCallback(
    async (keyOrText: string, opts?: { voice?: string; speed?: number }) => {
      const ctx = audioCtxRef.current!;
      let key = keyOrText;

      // keyOrText가 캐시에 없으면 텍스트로 판단 → 즉시 준비 후 재생
      if (!cacheRef.current.has(keyOrText)) {
        key = await prepare(keyOrText, opts);
      }

      const cached = cacheRef.current.get(key)!;
      if (ctx.state === 'suspended') await ctx.resume();

      const src = ctx.createBufferSource();
      src.buffer = cached.buffer;
      src.connect(ctx.destination);
      setIsSpeaking(true);
      src.start();
      src.onended = () => setIsSpeaking(false);

      return cached.dur;
    },
    [prepare],
  );

  return {
    isSpeaking,
    prepare, // 선준비(합성+디코딩)
    play, // 캐시 즉시 재생(없으면 준비 후 재생)
    playCached: (key: string) => play(key), // alias
    has: (text: string, voice = 'default', speed = 1) =>
      cacheRef.current.has(`${voice}:${speed}:${text}`),
  };
}
