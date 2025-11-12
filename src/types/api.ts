/**
 * 모든 API 응답을 위한 표준 래퍼(wrapper) 인터페이스.
 * T는 실제 데이터의 타입을 나타냅니다.
 */

export interface ApiResponse<T> {
  isSuccess?: boolean;
  code: string;
  message: string;
  data?: T;
}

/**
 * API 요청에서 발생하는 모든 에러를 위한 Custom Error 클래스.
 * TanStack Query의 onError 콜백에서 이 타입을 사용하게 됩니다.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status: number, code: string) {
    super(message); // Error 클래스의 message 속성 설정
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}