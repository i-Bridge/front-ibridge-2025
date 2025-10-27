// /app/child/[childId]/complete/page.tsx

'use client';

import { useRouter, useParams } from 'next/navigation';
import AvatarIcon from '../_components/AvatarIcons';
/**
 * 말풍선 꼬리표 아이콘 (직접 SVG로 만듦)
 */
function LeafLogo() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.2209 13.7915C19.2209 13.7915 17.653 10.0213 14.288 8.01997C14.288 8.01997 12.3553 11.5947 13.7371 14.591C15.1189 17.5873 17.4164 19.3444 19.2209 19.7826C19.2209 19.7826 21.0567 17.9157 19.2209 13.7915Z"
        fill="#FF6B31"
        opacity="0.6"
      />
      <path
        d="M17.0707 10.963C17.0707 10.963 14.4332 7.74934 11.5303 7.82029C11.5303 7.82029 10.1611 10.8258 12.0622 13.7547C13.9633 16.6836 16.208 17.9573 17.4851 17.5898C17.4851 17.5898 18.7303 15.6558 17.0707 10.963Z"
        fill="#FF6B31"
      />
      <path
        d="M7.70834 5.34176C7.70834 5.34176 9.80735 7.18223 9.40939 10.2372C9.40939 10.2372 7.14389 9.94632 5.67139 7.76993C4.19889 5.59354 4.09315 3.52834 4.8876 2.89014C4.8876 2.89014 6.13621 3.96874 7.70834 5.34176Z"
        fill="#FF6B31"
      />
    </svg>
  );
}

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

export default function ConversationCompletePage() {
  const router = useRouter();
  const params = useParams();
  const childId = params.childId as string;

  const handleGoHome = () => {
    if (childId) {
      router.push(`/child/${childId}/home`);
    } else {
      router.push('/'); // 비상시 홈으로
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-primary-primaryLight p-6">
      {/* 1. 좌상단 로고 */}
      <div className="absolute top-6 left-6">
        <LeafLogo />
      </div>

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
