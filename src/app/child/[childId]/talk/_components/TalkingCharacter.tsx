'use client';

import Image from 'next/image';

type Size = { w: number; h: number };
type Percent = { x: number; y: number }; // 0~1 (바디 원본 기준 퍼센트)

type Props = {
  isSpeaking: boolean;

  /** 화면에 보일 최종 크기(px) */
  width?: number;
  height?: number;

  /** 바디 원본 크기(px) — 디자이너가 준 원본(@1x/@2x 어떤 것이든 '원본 픽셀 그대로') */
  baseSize?: Size;

  /** 스프라이트 한 프레임의 원본 크기(px) — 2프레임 시 1000x1000 */
  frameSize?: Size;

  /** 바디 원본 좌표계 기준 '부리 중심' 위치(퍼센트) — 처음엔 대략 0.5, 0.56로 시작해서 미세조정 */
  beakAnchorPct?: Percent;

  /** 에셋 경로 */
  bodySrc?: string; // 부리 없는 바디
  beakSpriteSrc?: string; // 부리 스프라이트 (가로 2프레임)
};

export default function TalkingCharacter({
  isSpeaking,
  width = 468, // 화면에서 보일 크기 (예시)
  height = 481, // 화면에서 보일 크기 (예시)
  baseSize = { w: 931.99, h: 958.33 }, // ★ 네가 준 바디 원본
  frameSize = { w: 1000, h: 1000 }, // ★ 2000x1000의 1프레임
  beakAnchorPct = { x: 0.5, y: 0.56 }, // ★ 대략 중앙 살짝 아래 — 필요 시 0.01 단위로 조정
  bodySrc = '/images/talking-owlly.webp',
  beakSpriteSrc = '/images/mouth-sprite.webp',
}: Props) {
  // ✅ 1) 단일 스케일(가로 기준)만 사용
  const s = width / baseSize.w; // ← sx, sy 따로 쓰지 않기

  // ✅ 2) 프레임 표시 크기: 정수 고정(정사각 프레임이라 bh = bw)
  const bw = Math.round(frameSize.w * s);
  const bh = bw; // Math.round(frameSize.h * s) 대신, 정사각이면 bw로 통일

  // ✅ 3) 앵커 계산도 같은 s로, 그리고 정수 반올림
  const ax = beakAnchorPct.x * baseSize.w * s;
  const ay = beakAnchorPct.y * baseSize.h * s;
  const left = Math.round(ax - bw / 2);
  const top = Math.round(ay - bh / 2);

  return (
    <div className="relative" style={{ width, height }}>
      {/* 1) 바디(부리 없음) */}
      <Image
        src={bodySrc}
        alt="캐릭터"
        width={width}
        height={height}
        priority
      />
      <span
        className={`absolute pointer-events-none beak-sprite ${isSpeaking ? 'beak-play' : ''}`}
        style={{
          left,
          top,
          width: bw,
          height: bh,
          backgroundImage: `url('${beakSpriteSrc}')`,
          backgroundPosition: '0px 0px',
          // 배경크기/점프를 '같은 수'로 묶는 CSS 변수
          ['--bw' as any]: `${bw}px`,
          ['--bh' as any]: `${bh}px`,
        }}
        aria-hidden
      />
    </div>
  );
}
