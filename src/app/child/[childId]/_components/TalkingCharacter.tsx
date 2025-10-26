'use client';

// React를 import해야 CSSProperties 타입을 정확히 참조할 수 있습니다.
import React, { useState } from 'react';
import Image from 'next/image';

type Size = { w: number; h: number };
type Percent = { x: number; y: number };

type Props = {
  isSpeaking: boolean;
  width?: number;
  height?: number;
  baseSize?: Size;
  frameSize?: Size;
  beakAnchorPct?: Percent;
  bodySrc?: string;
  beakSpriteSrc?: string;
};

export default function TalkingCharacter({
  isSpeaking,
  width = 468,
  height = 481,
  baseSize = { w: 931.99, h: 958.33 },
  frameSize = { w: 1000, h: 1000 },
  beakAnchorPct = { x: 0.5, y: 0.56 },
  bodySrc = '/images/talking-owlly.webp',
  beakSpriteSrc = '/images/mouth-sprite.webp',
}: Props) {
  const [isBodyLoaded, setIsBodyLoaded] = useState(false);

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
    opacity: isBodyLoaded ? 1 : 0,
  };

  return (
    <div className="relative" style={{ width, height }}>
      <Image
        src={bodySrc}
        alt="캐릭터"
        // ✅ [수정] width/height prop에는 원본 이미지의 크기(baseSize)를 전달해야 합니다.
        width={baseSize.w}
        height={baseSize.h}
        priority
        quality={100}
        // ✅ [수정] Next.js 경고를 해결하고 부리 위치를 올바르게 맞춥니다.
        // 이미지가 부모 div의 너비(width)에 100% 맞춰지고,
        // 높이(height)는 가로세로 비율에 맞게 'auto'로 설정됩니다.
        style={{
          width: '100%',
          height: 'auto',
          objectFit: 'contain',
        }}
        onLoad={() => setIsBodyLoaded(true)}
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
