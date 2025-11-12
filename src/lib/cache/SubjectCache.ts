/*
 * 파일 경로: src/lib/subjectCache.ts
 * (새로 생성하세요)
 */
import { Question, Subject } from '@/types/index';



export interface CachedSubjectData {
  subject: Subject;
  questions: Question[];
}

// 캐시 저장소와 정책을 이 모듈 내에서만 관리합니다.
const cache = new Map<string, CachedSubjectData>();
const MAX_CACHE_SIZE = 10;

/**
 * 캐시에서 데이터를 조회합니다.
 * @param key - 조회할 캐시 키
 */
const get = (key: string): CachedSubjectData | undefined => {
  return cache.get(key);
};

/**
 * 캐시에 데이터를 저장하고, 캐시 크기를 관리합니다.
 * @param key - 저장할 캐시 키
 * @param value - 저장할 데이터
 */
const set = (key: string, value: CachedSubjectData): void => {
  cache.set(key, value);

  // 캐시 사이즈 관리 (LRU 방식: 가장 오래된 항목 삭제)
  if (cache.size > MAX_CACHE_SIZE) {
    // Map.keys().next().value는 Map에서 가장 오래된 키를 반환합니다.
    const oldestKey = cache.keys().next().value;
    if (oldestKey !== undefined) {
      cache.delete(oldestKey);
    }
  }
};

/**
 * 표준화된 캐시 키를 생성합니다.
 */
const createKey = (
  childId: string | number,
  subjectId: string | number,
): string => {
  return `${childId}_${subjectId}`;
};

// 캐시 서비스를 객체로 export 합니다.
export const subjectCache = {
  get,
  set,
  createKey,
};