'use client'; // error.tsx는 반드시 'use client'여야 합니다.

import { useEffect } from 'react';
import Link from 'next/link';

import * as Sentry from '@sentry/nextjs';
import { Button } from '@/ui/Button';
import ErrorDisplay from '@/components/Exception/ErrorDisplay'; // 1번에서 만든 공통 컴포넌트

/**
 * join-status 세그먼트의 런타임 오류 발생 시 보여줄 예비 UI
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {

  useEffect(() => {
    // [오류 로깅]
    Sentry.captureException(error);
    console.error(error);
  }, [error]);

  return (
    <ErrorDisplay
      title="오류가 발생했어요"
      message="페이지를 불러오는 중 문제가 발생했습니다."
      actions={
        // 런타임 오류는 "다시 시도"와 "메인으로" 2개 버튼 제공
        <>
          <Button variant="grayscale" onClick={() => reset()} className='w-full h-16'>
            다시 시도하기
          </Button>
          <Button as={Link} href="/" variant="primary" className='whitespace-nowrap w-full h-16'>
            메인으로 이동하기
          </Button>
        </>
      }
    />
  );
}
