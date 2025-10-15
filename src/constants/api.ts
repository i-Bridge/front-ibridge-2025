//
// API 경로(항상 string childId 사용)
//
export const API = {
  childHome: (childId: string) => `/child/${childId}/home`,
  emotion: (childId: string) => `/child/${childId}/emotion`,
  predesigned: (childId: string) => `/child/${childId}/predesigned`,
  new: (childId: string) => `/child/${childId}/new`,
  finished: (childId: string) => `/child/${childId}/finished`,
  getBunch: (childId: string) => `/child/${childId}/getBunch`,
} as const;
