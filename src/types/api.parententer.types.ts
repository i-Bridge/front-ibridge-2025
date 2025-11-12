// /parent/mypage
// /parent/{childId}/banner
// /parent/{childId}/stat/cumulative
// /parent/{childId}/keywords


// /parent/{childId}/stat/subject -키워드 누르면

import { Category } from './stats.types';
/**
 * /parent/{childId}/banner API의 응답 데이터 타입입니다.
 * (AI 배너 정보 반환)
 *
 * @example
 * {
 *  date: 2025-10-31;
 *  cumulativeAnswerCount: 46,
 *  mostTalkedCategory: '외모스타일',
 *  positiveCategory: null,
 *  negativeCategory: null,
 *  name: '세리'
 * }
 */

export interface BannerResponse {
  date: string;
  cumulativeAnswerCount: number;
  mostTalkedCategory: string;
  positiveCategory: string;
  negativeCategory: string;
  emotion: number;
  name: string;
}


/**
 * /parent/{childId}/keywords API의 응답 데이터 타입입니다.
 * (카테고리 정보를 답변 개수 순위에 맞게 반환)
 *
 * @example
 * {
 * keywords: [
 * { category: "가족", count: 10, positiveScore: 80 },
 * { category: "학교", count: 5, positiveScore: 40 }
 * ],
 * }
 */

export interface KeywordResponse {
  categories: Category[];
}