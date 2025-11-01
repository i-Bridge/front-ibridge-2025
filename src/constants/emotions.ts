import React from 'react';
// ✅ [수정] 요청하신 9개의 아이콘 컴포넌트를 모두 임포트합니다.
import {
  IconHappy,
  IconAngry,
  IconSad,
  IconRainy,
  IconSurprised,
  IconWorried,
  IconConfused,
  IconLucky,
  IconSunny,
} from './EmotionIcons';

export type EmotionOption = {
  /** 백엔드에 보내는 정수 ID */
  id: number;
  // ✅ [수정] key 타입을 확장하여 새로운 감정들을 포함합니다.
  key:
    | 'happy'
    | 'sad'
    | 'angry'
    | 'surprised'
    | 'worried'
    | 'confused'
    | 'lucky'
    | 'sunny'
    | 'rainy';
  labelKo: string;
  icon: React.ComponentType<{ className?: string }>;
};

export type EmotionId = EmotionOption['id'];
export type EmotionKey = EmotionOption['key'];

// ✅ [수정] EMOTIONS 배열을 9개의 아이콘에 맞춰 새롭게 정의합니다.
export const EMOTIONS = [
  {
    id: 1,
    key: 'happy',
    labelKo: '기쁜',
    icon: IconHappy,
  },
  { id: 2, key: 'sad', labelKo: '슬픈', icon: IconSad },
  {
    id: 3,
    key: 'angry',
    labelKo: '화나는',
    icon: IconAngry,
  },
  {
    id: 4,
    key: 'surprised',
    labelKo: '놀라운',
    icon: IconSurprised,
  },
  {
    id: 5,
    key: 'worried',
    labelKo: '걱정스러운',
    icon: IconWorried,
  },
  {
    id: 6,
    key: 'confused',
    labelKo: '혼란스러운',
    icon: IconConfused,
  },
  {
    id: 7,
    key: 'lucky',
    labelKo: '행운 가득한',
    icon: IconLucky,
  }, // 네잎클로버
  {
    id: 8,
    key: 'sunny',
    labelKo: '맑은',
    icon: IconSunny,
  }, // 해
  {
    id: 9,
    key: 'rainy',
    labelKo: '흐린',
    icon: IconRainy,
  }, // 우산(비)
] as const satisfies readonly EmotionOption[];

// id → option 빠른 조회
// (이 코드는 EMOTIONS 배열에 따라 자동으로 생성되므로 수정할 필요가 없습니다.)
export const EMOTION_BY_ID: Record<EmotionId, EmotionOption> = EMOTIONS.reduce(
  (acc, e) => {
    acc[e.id] = e;
    return acc;
  },
  {} as Record<EmotionId, EmotionOption>,
);

// 타입 가드
// (이 코드도 자동으로 업데이트되므로 수정할 필요가 없습니다.)
export const isEmotionId = (x: unknown): x is EmotionId =>
  typeof x === 'number' && EMOTIONS.some((e) => e.id === x);
