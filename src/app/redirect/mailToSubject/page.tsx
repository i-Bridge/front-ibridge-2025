'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function RedirectMailToSubject() {
  const searchParams = useSearchParams();
  const target = searchParams.get('target');
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (target) {
        router.push(target);
      }
    }, 1500); // 1.5초 후 이동

    return () => clearTimeout(timeout);
  }, [target,router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-xl font-bold">다른 자식 페이지로 이동 중입니다...</h1>
    </div>
  );
}
