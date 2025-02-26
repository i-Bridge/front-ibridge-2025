'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Progress from './progress';

export default function ChildHome() {
  const router = useRouter();
  const params = useParams(); // 동적으로 params 가져오기
  const [childId, setChildId] = useState<string | null>(null);

  console.log("Params 값 (ChildHome):", params); // params 확인

  useEffect(() => {
    if (params.id) {
      // params.id가 배열인 경우 첫 번째 값을 사용하고, 그렇지 않으면 그대로 사용
      setChildId(Array.isArray(params.id) ? params.id[0] : params.id);
    }
  }, [params.id]);

  const goToHome = () => {
    if (childId) {
      router.push(`/child/home`); // 동적으로 이동
    } else {
      console.error("childId가 존재하지 않습니다!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* 캐릭터 위치 */}
      <div
        className="w-24 h-24 bg-gray-400 rounded-full flex items-center justify-center mb-6 cursor-pointer"
        style={{ marginTop: '-5%' }}
        onClick={goToHome}
      >
        캐릭터
      </div>
      {/* 진행 상황 표시 */}
      <Progress />
    </div>
  );
}
