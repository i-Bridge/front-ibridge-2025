'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import type { Child } from '@/types';

type Props = {
  childrenData: Child[];
};

export default function ChildSelector({ childrenData }: Props) {
  const router = useRouter();

  // ✅ [추가] 전체 화면으로 전환하고 페이지를 이동시키는 함수입니다.
  const handleFullscreenAndNavigate = useCallback(
    (childId: number) => {
      // 1. 문서의 최상위 요소를 전체 화면으로 만듭니다.
      // 풀스크린 API를 지원하는지 확인하는 것이 좋습니다.
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {
          // 사용자가 전체 화면 요청을 거부하거나 API를 지원하지 않는 경우,
          // 페이지 이동은 정상적으로 이루어지도록 합니다.
          console.warn(`전체 화면 전환에 실패했습니다: ${err.message}`);
        });
      }

      // 2. 전체 화면 전환 시도 후, 해당 아동의 talk 페이지로 이동합니다.
      router.push(`/child/${childId}/talk`);
    },
    [router],
  );

  return (
    <div className="flex justify-center items-center flex-wrap gap-8 p-8 bg-orange-100">
      {childrenData.map((child) => (
        <div key={child.id} className="flex flex-col items-center">
          <div
            onClick={() => handleFullscreenAndNavigate(child.id)}
            className="text-2xl w-32 h-32 bg-i-lightorange rounded-full hover:shadow-md hover:bg-i-lightorange/70 cursor-pointer flex items-center justify-center text-white text-center break-words"
          >
            {child.name}
          </div>
        </div>
      ))}
    </div>
  );
}
