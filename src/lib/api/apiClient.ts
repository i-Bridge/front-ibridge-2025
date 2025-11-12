
import axios, { AxiosResponse, type AxiosError } from 'axios';
import { getSession } from 'next-auth/react';
import { ApiError, type ApiResponse } from '@/types/api';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// 요청 인터셉터 (변경 없음)
apiClient.interceptors.request.use(
  async (config) => {
   // 인증이 필요 없는 요청은 건너뛰기 (예: 헤더에 skip-auth 플래그 추가)
    if (config.headers['X-Skip-Auth']) {
      return config;
    }

    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
      config.headers.Provider = session.provider || '';
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ⭐️ 응답 인터셉터 (로직 수정)
apiClient.interceptors.response.use(
  // 1. 성공 콜백 (onFulfilled)
  (response: AxiosResponse) => { // ⭐️ 1. 타입을 보다 일반적인 AxiosResponse로 변경
    const apiResponse = response.data;

    // ⭐️ 2. 타입 가드: response.data가 우리가 예상한 ApiResponse 형태인지 먼저 확인
    if (apiResponse && typeof apiResponse === 'object' && 'isSuccess' in apiResponse) {
      // 형태가 맞다면, 비즈니스 로직 검사
      if (!apiResponse.isSuccess) {
        throw new ApiError(
          apiResponse.message,
          response.status,
          apiResponse.code,
        );
      }
      
      // 성공 시, data 프로퍼티만 담아서 response 객체를 변환 후 반환
      response.data = (apiResponse as ApiResponse<unknown>).data;
      return response;

    } else {
      // ⭐️ 3. 예상치 못한 형태의 응답이 오면, 일반적인 서버 에러로 처리
      // (예: 서버가 JSON이 아닌 HTML 에러 페이지를 반환한 경우)
      throw new ApiError(
        '서버로부터 유효하지 않은 응답을 받았습니다.',
        response.status,
        'INVALID_RESPONSE_FORMAT'
      );
    }
  },

// ❌ 2. 실패한 응답 처리 (HTTP Status Code: 4xx, 5xx)
  (error: AxiosError) => {
    if (error.response) {
      // 서버가 응답을 했지만, 에러 상태 코드일 때
      const responseData = error.response.data as Partial<ApiResponse<never>> | undefined;
      const message = responseData?.message || '서버와 통신 중 오류가 발생했습니다.';
      const code = responseData?.code || 'UNKNOWN_ERROR';
      const status = error.response.status;

      // 표준 ApiError 객체를 throw
      throw new ApiError(message, status, code);
    } 
    // 네트워크 오류 등으로 서버 응답 자체가 없었던 경우
    else {
      throw new ApiError(error.message || '네트워크 오류가 발생했습니다.', 500, 'NETWORK_ERROR');
    }
  },
);

export default apiClient;