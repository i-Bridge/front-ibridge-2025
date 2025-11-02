'use client'; // router 사용을 위해 클라이언트 컴포넌트로 선언

import { useRouter } from 'next/navigation';
import { Button } from '@/ui/Button';
import ErrorDisplay from '@/components/Exception/ErrorDisplay';

/**
 * 전역 404 (Not Found) 페이지
 * 존재하지 않는 URL로 접근 시 이 페이지가 렌더링됩니다.
 */
export default function NotFound() {
  const router = useRouter();

  return (
    <ErrorDisplay
      title="404 Not Found"
      message="요청하신 페이지를 찾을 수 없어요!"
      actions={
        // 404 페이지는 "다시 시도"가 의미 없으므로 "메인으로" 버튼만 제공
        <Button variant="primary" onClick={() => router.push('/')}>
          메인으로 이동하기
        </Button>
      }
    />
  );
}
