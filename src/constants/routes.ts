//
// 라우트 경로 헬퍼(항상 string childId 사용)
//
export const ROUTES = {
  talkQuestion: (childId: string) => `/child/${childId}/talk/question`,
  talkFree: (childId: string) => `/child/${childId}/talk/free`,
} as const;
