'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { getAudioContext } from '@/lib/audio';

type TTSSource = {
  buffer: AudioBuffer;
  dur: number;
};

type StreamOpts = {
  voice?: string;
  speed?: number;
  firstChunkViaWebAudio?: boolean;
};

export function useMinimaxTTS() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const cacheRef = useRef<Map<string, TTSSource>>(new Map());
  const currentAbortRef = useRef<AbortController | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentBufferSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // ✅ 변경: 싱글톤 AudioContext 사용
  useEffect(() => {
    audioCtxRef.current = getAudioContext();
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
    } catch {}
    setIsSpeaking(false);
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
      const ctx = audioCtxRef.current ?? getAudioContext(); // ✅ 안전 보강
      audioCtxRef.current = ctx;

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
      setIsSpeaking(true);

      // ✅ 싱글톤 보장
      const ctx = audioCtxRef.current ?? getAudioContext();
      audioCtxRef.current = ctx;

      let key = keyOrText;
      if (!cacheRef.current.has(keyOrText)) {
        key = await prepare(keyOrText, opts);
      }
      const cached = cacheRef.current.get(key)!;

      if (ctx.state === 'suspended') await ctx.resume();

      return new Promise<number>((resolve) => {
        const src = ctx.createBufferSource();
        currentBufferSourceRef.current = src;
        src.buffer = cached.buffer;
        src.connect(ctx.destination);
        src.start();
        src.onended = () => {
          if (currentBufferSourceRef.current === src) {
            currentBufferSourceRef.current = null;
          }
          setIsSpeaking(false);
          resolve(cached.dur);
        };
      });
    },
    [prepare, cancel],
  );

  const _playStreamOnce = useCallback(
    async (text: string, opts?: StreamOpts) => {
      const controller = currentAbortRef.current;
      if (!controller) throw new Error('AbortController가 없습니다.');

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
                      if (!sourceBuffer.updating) mediaSource.endOfStream();
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

              audioEl.play().catch(reject);
              audioEl.onended = () => resolve();
              audioEl.onerror = (e) => reject(e);
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

  const playStreamSmart = useCallback(
    async (
      text: string,
      onChunkStart: (chunkText: string, isFirstChunk: boolean) => void,
      opts?: StreamOpts,
    ) => {
      // 1) 이전 재생 정리
      cancel();
      currentAbortRef.current = null;
      currentAudioRef.current = null;
      currentBufferSourceRef.current = null;

      // 2) 새 스트리밍 컨트롤러
      const controller = new AbortController();
      currentAbortRef.current = controller;

      // 3) 말하기 시작
      try {
        const chunks = text
          .split(/(?<=[\.!\?。！？\n,،])/)
          .map((s) => s.trim())
          .filter(Boolean);
        if (chunks.length === 0 && text) chunks.push(text);

        let isFirst = true;

        // ⭐ 첫 문장은 WebAudio 경로로 재생(오토플레이 회피에 가장 강함)
        if (opts?.firstChunkViaWebAudio && chunks.length > 0) {
          const first = chunks.shift()!;
          onChunkStart(first, true);
          // play() 내부에서 isSpeaking true/false를 관리하므로 여기서 setIsSpeaking(true) 금지
          try {
            await play(first, opts);
          } catch (e) {
            // 혹시 실패해도 아래 스트리밍 루프로 이어짐
            console.warn('첫 문장 WebAudio 재생 실패:', e);
          }
          isFirst = false; // 이후 스트리밍 루프는 두 번째 문장부터
        } else {
          // 스트리밍 시퀀스 시작 시에만 true
          setIsSpeaking(true);
        }

        // 2) 나머지 문장 스트리밍 재생
        for (const chunk of chunks) {
          onChunkStart(chunk, isFirst);
          isFirst = false;

          try {
            await _playStreamOnce(chunk, opts);
          } catch (e) {
            if (controller.signal.aborted) {
              console.log('🔇 의도적 중단: 폴백 스킵');
              return;
            }
            // 스트리밍 실패 시 WebAudio로 폴백
            console.warn('스트리밍 실패 → 일반 재생 폴백:', chunk, e);
            try {
              await play(chunk, opts);
            } catch (playError) {
              console.error('폴백 재생 실패:', playError);
            }
          }
        }
      } finally {
        // 첫 문장을 WebAudio로만 재생했다면 위에서 이미 false로 내려감
        // 그 외 스트리밍 경로라면 여기서 false 처리
        setIsSpeaking(false);
      }
    },
    [_playStreamOnce, play, cancel],
  );

  return { isSpeaking, prepare, play, playStreamSmart, cancel };
}
