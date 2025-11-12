/*
 * 파일 경로: src/lib/dateSubjectCache.ts
 * (이 파일을 새로 생성하세요)
 */
import { DateSubject } from '@/types/index';
import { format } from 'date-fns';

// 캐시할 데이터 타입 (해당 날짜의 Subject 배열)
export type CachedDateSubjects = DateSubject[];
// 캐시 저장소 (Key: "childId_yyyy-MM-dd")
const cache = new Map<string, CachedDateSubjects>();
const MAX_CACHE_SIZE = 10; // 예: 최근 10일치 날짜의 데이터를 캐싱

/**
 * 캐시에서 데이터를 조회합니다.
 * @param key - 조회할 캐시 키 (e.g., "123_2025-10-21")
 */
const get = (key: string): CachedDateSubjects | undefined => {
  return cache.get(key);
};

/**
 * 캐시에 데이터를 저장하고, 캐시 크기를 관리합니다.
 * @param key - 저장할 캐시 키
 * @param value - 저장할 데이터 (Subject 배열)
 */
const set = (key: string, value: CachedDateSubjects): void => {
  // 데이터를 캐시에 추가
  cache.set(key, value);

  // 캐시 사이즈 관리 (가장 오래된 항목(LRU) 삭제)
  if (cache.size > MAX_CACHE_SIZE) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey !== undefined) {
      cache.delete(oldestKey);
    }
  }
};

/**
 * 표준화된 캐시 키를 생성합니다. (childId + date)
 * @param childId - 자식 ID
 * @param date - 날짜 객체
 */
const createKey = (childId: string | number, date: Date): string => {
  const dateStr = format(date, 'yyyy-MM-dd'); // "2025-10-21"
  return `${childId}_${dateStr}`;
};

// 캐시 서비스를 객체로 export 합니다.
export const dateSubjectCache = {
  get,
  set,
  createKey,
};