'use client';

// React를 import해야 CSSProperties 타입을 정확히 참조할 수 있습니다.
import React from 'react';
import Image from 'next/image';

type Size = { w: number; h: number };
type Percent = { x: number; y: number };

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
  bodySrc?: string;
  beakSpriteSrc?: string;
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
  const s = width / baseSize.w;
  const bw = Math.round(frameSize.w * s);
  const bh = bw;
  const ax = beakAnchorPct.x * baseSize.w * s;
  const ay = beakAnchorPct.y * baseSize.h * s;
  const left = Math.round(ax - bw / 2);
  const top = Math.round(ay - bh / 2);

  const beakStyle: React.CSSProperties & { [key: `--${string}`]: string } = {
    left,
    top,
    width: bw,
    height: bh,
    backgroundImage: `url('${beakSpriteSrc}')`,
    backgroundPosition: '0px 0px',
    '--bw': `${bw}px`,
    '--bh': `${bh}px`,
  };

  return (
    <div className="relative" style={{ width, height }}>
      <Image
        src={bodySrc}
        alt="캐릭터"
        width={width}
        height={height}
        priority
      />
      <span
        className={`absolute pointer-events-none beak-sprite ${
          isSpeaking ? 'beak-play' : ''
        }`}
        style={beakStyle}
        aria-hidden
      />
    </div>
  );
}
