// /lib/audio.ts
let ctx: AudioContext | null = null;

export function getAudioContext() {
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    ctx = new AC();
  }
  return ctx!;
}

// 반드시 "사용자 제스처(onClick)" 안에서 호출
export async function unlockAudio(): Promise<void> {
  const audioCtx = getAudioContext();
  if (audioCtx.state !== 'running') {
    await audioCtx.resume();
  }
  // iOS Safari 호환: 무음 1샘플 재생으로 워밍업
  try {
    const src = audioCtx.createBufferSource();
    const buf = audioCtx.createBuffer(1, 1, audioCtx.sampleRate);
    src.buffer = buf;
    src.connect(audioCtx.destination);
    src.start(0);
    src.stop(audioCtx.currentTime + 0.01);
  } catch {}
}
