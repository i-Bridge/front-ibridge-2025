'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

type TTSSource = {
  buffer: AudioBuffer;
  dur: number;
};

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
  const currentBufferSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    audioCtxRef.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
  }, []);

  const cancel = useCallback(() => {
    console.log('🛑 [TTS] 모든 오디오 재생을 중단합니다.');
    currentAbortRef.current?.abort();
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.src = '';
    }
    try {
      currentBufferSourceRef.current?.stop();
    } catch (e) {}

    setIsSpeaking(false);
    currentAbortRef.current = null;
    currentAudioRef.current = null;
    currentBufferSourceRef.current = null;
  }, []);

  const makeKey = (text: string, voice = 'default', speed = 1) =>
    `${voice}:${speed}:${text}`;

  const prepare = useCallback(
    async (text: string, opts?: { voice?: string; speed?: number }) => {
      const key = makeKey(text, opts?.voice, opts?.speed);
      if (cacheRef.current.has(key)) return key;
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
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
      cancel();
      const ctx = audioCtxRef.current!;
      let key = keyOrText;
      if (!cacheRef.current.has(keyOrText)) {
        key = await prepare(keyOrText, opts);
      }
      const cached = cacheRef.current.get(key)!;
      if (ctx.state === 'suspended') await ctx.resume();
      const src = ctx.createBufferSource();
      currentBufferSourceRef.current = src;
      src.buffer = cached.buffer;
      src.connect(ctx.destination);
      setIsSpeaking(true);
      src.start();
      src.onended = () => {
        if (currentBufferSourceRef.current === src) {
          setIsSpeaking(false);
          currentBufferSourceRef.current = null;
        }
      };
      return cached.dur;
    },
    [prepare, cancel],
  );

  const _playStreamOnce = useCallback(
    async (text: string, opts?: StreamOpts) => {
      cancel();
      const controller = new AbortController();
      currentAbortRef.current = controller;
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: opts?.voice ?? 'default',
          speed: opts?.speed ?? 1,
          stream: true,
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
                if (currentAudioRef.current === audioEl) {
                  setIsSpeaking(false);
                  currentAudioRef.current = null;
                  currentAbortRef.current = null;
                }
                resolve();
              };
              audioEl.onerror = (e) => {
                if (currentAudioRef.current === audioEl) {
                  setIsSpeaking(false);
                  currentAudioRef.current = null;
                  currentAbortRef.current = null;
                }
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
    [cancel],
  );

  const playStreamSmart = useCallback(
    async (
      text: string,
      onChunkStart: (chunkText: string, isFirstChunk: boolean) => void,
      opts?: StreamOpts,
    ) => {
      const chunks = text
        .split(/(?<=[\.!\?。！？\n,،])/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (chunks.length === 0 && text) chunks.push(text);
      let isFirst = true;
      for (const chunk of chunks) {
        onChunkStart(chunk, isFirst);
        isFirst = false;
        try {
          await _playStreamOnce(chunk, opts);
        } catch (e) {
          // ✅ [수정] 에러의 종류를 확인하여, AbortError인 경우에는 폴백을 실행하지 않습니다.
          if (e instanceof Error && e.name === 'AbortError') {
            break;
          } else {
            // AbortError가 아닌 다른 네트워크 오류 등의 경우에만 폴백을 시도합니다.
            console.warn('⚠️ 스트리밍 실패, 일반 재생으로 폴백:', chunk, e);
            try {
              await play(chunk, opts);
            } catch {
              /* ignore */
            }
          }
        }
      }
    },
    [_playStreamOnce, play],
  );

  return {
    isSpeaking,
    prepare,
    play,
    playStreamSmart,
    cancel,
  };
}
