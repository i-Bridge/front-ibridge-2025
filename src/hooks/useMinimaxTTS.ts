// hooks/useMinimaxTTS.ts
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

type TTSSource = {
  buffer: AudioBuffer;
  dur: number;
};

// ✨ 스트리밍 옵션 타입
type StreamOpts = {
  voice?: string;
  speed?: number;
};

export function useMinimaxTTS() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const cacheRef = useRef<Map<string, TTSSource>>(new Map());
  const currentAbortRef = useRef<AbortController | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

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

      // 1. 음성 합성 요청 (Synthesis): 서버에 텍스트를 보냄
      // 음성 데이터(mp3)로 변환해달라고 요청
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

      // 2. 오디오 파일 전체 다운로드:
      // 합성된 mp3 파일 전체가 브라우저로 다운로드 될 때까지 기다림
      const buf = await res.arrayBuffer();
      const ctx = audioCtxRef.current!;

      // 3. 오디오 디코딩 (Decoding):
      // 다운로드된 MP3 파일(buf)을 브라우저가 즉시 재생할 수 있는 원시 오디오 데이터 형식(AudioBuffer)으로 변환(해독)
      // mp3 → AudioBuffer로 디코딩(압축된 MP3를 압축 해제하여 메모리에 펼침)

      const audioBuffer = await ctx.decodeAudioData(buf);

      // 4. 캐시에 저장:
      //해독까지 완료된 AudioBuffer를 cacheRef라는 자바스크립트 Map 객체에 저장합니다. 이제 이 오디오는 네트워크 요청이나 디코딩 없이 메모리에서 바로 꺼내 쓸 수 있는 상태가 됨.
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

      // keyOrText가 캐시에 없으면 즉시 준비 후 재생
      if (!cacheRef.current.has(keyOrText)) {
        key = await prepare(keyOrText, opts);
      }

      // 있으면 캐시에 있는걸 재생
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
  // ✨ --- 스트리밍 로직 추가 --- ✨

  /** [내부함수] 단일 텍스트 스트리밍 재생 */
  const _playStreamOnce = useCallback(
    async (text: string, opts?: StreamOpts) => {
      currentAbortRef.current?.abort();
      currentAudioRef.current?.pause?.();

      const controller = new AbortController();
      currentAbortRef.current = controller;

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: opts?.voice ?? 'default',
          speed: opts?.speed ?? 1,
          stream: true, // 👈 스트리밍 요청
          format: 'mp3',
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) throw new Error('Stream fetch failed');

      return new Promise<void>((resolve, reject) => {
        const mediaSource = new MediaSource();
        const audioEl = new Audio();
        audioEl.src = URL.createObjectURL(mediaSource);
        currentAudioRef.current = audioEl;

        mediaSource.addEventListener(
          'sourceopen',
          () => {
            try {
              const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
              const reader = res.body!.getReader();

              const updateEndHandler = () => {
                if (mediaSource.readyState === 'open') {
                  pump();
                }
              };

              sourceBuffer.addEventListener('updateend', updateEndHandler);

              const pump = () => {
                if (sourceBuffer.updating) return;
                reader
                  .read()
                  .then(({ done, value }) => {
                    if (done) {
                      if (!sourceBuffer.updating) {
                        mediaSource.endOfStream();
                      }
                      sourceBuffer.removeEventListener(
                        'updateend',
                        updateEndHandler,
                      );
                      return;
                    }
                    sourceBuffer.appendBuffer(value);
                  })
                  .catch(reject);
              };

              pump();

              setIsSpeaking(true);
              audioEl.play().catch(reject);
              audioEl.onended = () => {
                setIsSpeaking(false);
                resolve();
              };
              audioEl.onerror = (e) => {
                setIsSpeaking(false);
                reject(e);
              };
            } catch (e) {
              reject(e);
            }
          },
          { once: true },
        );
      });
    },
    [],
  );

  /** 텍스트를 작은 단위로 잘라 순차 스트리밍 + UI 동기화 콜백 */
  const playStreamSmart = useCallback(
    async (
      text: string,
      onChunkStart: (chunkText: string, isFirstChunk: boolean) => void,
      opts?: StreamOpts,
    ) => {
      const chunks = text
        .split(/(?<=[\.!\?。！？\n,،])/) // 쉼표(,) 기준으로 잘게 나눔
        .map((s) => s.trim())
        .filter(Boolean);

      if (chunks.length === 0 && text) chunks.push(text);

      let isFirst = true;
      for (const chunk of chunks) {
        onChunkStart(chunk, isFirst); // ✨ UI 업데이트 콜백 호출
        isFirst = false;

        try {
          await _playStreamOnce(chunk, opts);
        } catch (e) {
          console.warn('⚠️ 스트리밍 실패, 일반 재생으로 폴백:', chunk, e);
          try {
            await play(chunk, opts); // 실패 시 기존 방식으로 재생
          } catch {
            /* ignore */
          }
        }
      }
    },
    [_playStreamOnce, play],
  );
  return {
    isSpeaking, // 현재 tts가 재생 중인지
    prepare, // 선준비(합성+디코딩)
    play, // 캐시 즉시 재생(없으면 준비 후 재생)
    playStreamSmart, // ✨ 외부에서 사용할 스트리밍 함수
  };
}
