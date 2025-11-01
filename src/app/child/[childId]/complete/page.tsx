// /app/child/[childId]/complete/page.tsx

'use client';

import { useRouter, useParams } from 'next/navigation';
import AvatarIcon from '../_components/AvatarIcons';
import FullscreenToggle from '../_components/FullscreenToggle';
export default function ConversationCompletePage() {
  const router = useRouter();
  const params = useParams();
  const childId = params.childId as string;

  /**
   * 홈 아이콘 SVG
   */
  function HomeIcon() {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 9.75L12 3L21 9.75V21H15V15H9V21H3V9.75Z"
          fill="white"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  const handleGoHome = () => {
    if (childId) {
      router.push(`/child/${childId}/home`);
    } else {
      router.push('/'); // 비상시 홈으로
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-screen bg-primary-primaryLight p-6">
      {/* ============================================== */}
      {/* ✅ [추가] 헤더 */}
      {/* ============================================== */}
      <header className="absolute top-6 left-6 z-10">
        <FullscreenToggle />
      </header>
      <div className="flex flex-col items-center text-center">
        {/* 2. 캐릭터 이미지 */}
        <AvatarIcon className="w-60 h-60" />
        {/* 3. 완료 텍스트 */}
        <h1 className="text-4xl font-bold text-[#333] mt-8 leading-snug">
          오늘의 질문
          <br />
          <span className="text-[#FF6B31]">답변 완료!</span>
        </h1>

        {/* 4. 홈으로 이동하기 버튼 */}
        <button
          onClick={handleGoHome}
          className="mt-10 flex items-center justify-center gap-2
                     px-8 py-4 bg-[#FF6B31] text-white
                     font-bold text-lg rounded-full
                     shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <HomeIcon />
          홈으로 이동하기
        </button>

        {/* 5. 포도알 획득 정보 */}
        <div
          className="mt-6 inline-flex items-center justify-center gap-2
                      px-6 py-3 bg-white rounded-full shadow-md"
        >
          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
          <p className="text-gray-800 font-semibold">포도알 1개를 받았어요!</p>
        </div>
      </div>
    </div>
  );
}
