// /lib/audio.ts

// 1. window 객체에 webkitAudioContext가 있을 수 있음을 타입으로 정의합니다.
type WindowWithWebKitAudioContext = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

let ctx: AudioContext | null = null;

export function getAudioContext() {
  if (!ctx) {
    // 2. window를 위에서 정의한 타입으로 간주하여 사용합니다.
    const customWindow = window as WindowWithWebKitAudioContext;
    const AC = customWindow.AudioContext || customWindow.webkitAudioContext;

    if (!AC) {
      // AudioContext를 전혀 지원하지 않는 환경에 대한 예외 처리
      throw new Error('AudioContext is not supported in this browser.');
    }
    ctx = new AC();
  }
  return ctx; // `ctx!` 대신 그냥 ctx를 반환하는 것이 더 안전합니다.
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
  } catch (e) {
    console.log('오디오 워밍업 실패', e);
  }
}
