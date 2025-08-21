export type EmotionOption = {
  /** 백엔드에 보내는 정수 ID */
  id: number;
  /** 안정 키(국제화/로깅에 유용) */
  key: 'happy' | 'sad' | 'angry' | 'surprised' | 'worried' | 'confused';
  /** 기본 한국어 라벨 */
  labelKo: string;
  /** 이모지 */
  emoji: string;
};

export type EmotionId = EmotionOption['id'];
export type EmotionKey = EmotionOption['key'];

export const EMOTIONS = [
  { id: 1, key: 'happy', labelKo: '기쁨', emoji: '😊' },
  { id: 2, key: 'sad', labelKo: '슬픔', emoji: '😢' },
  { id: 3, key: 'angry', labelKo: '화남', emoji: '😠' },
  { id: 4, key: 'surprised', labelKo: '놀람', emoji: '😮' },
  { id: 5, key: 'worried', labelKo: '걱정', emoji: '😟' },
  { id: 6, key: 'confused', labelKo: '혼란', emoji: '😕' },
] as const satisfies readonly EmotionOption[];

// id → option 빠른 조회
export const EMOTION_BY_ID: Record<EmotionId, EmotionOption> = EMOTIONS.reduce(
  (acc, e) => {
    acc[e.id] = e;
    return acc;
  },
  {} as Record<EmotionId, EmotionOption>,
);

// 타입 가드
export const isEmotionId = (x: unknown): x is EmotionId =>
  typeof x === 'number' && EMOTIONS.some((e) => e.id === x);

//
// API 경로(항상 string childId 사용)
//
export const API = {
  childHome: (childId: string) => `/child/${childId}/home`,
  emotion: (childId: string) => `/child/${childId}/emotion`,
  predesigned: (childId: string) => `/child/${childId}/predesigned`,
  new: (childId: string) => `/child/${childId}/new`,
  finished: (childId: string) => `/child/${childId}/finished`,
} as const;

//
// 라우트 경로 헬퍼(항상 string childId 사용)
//
export const ROUTES = {
  talk: (childId: string) => `/child/${childId}/talk`,
  talkQuestion: (childId: string) => `/child/${childId}/talk/question`,
  talkFree: (childId: string) => `/child/${childId}/talk/free`,
} as const;
