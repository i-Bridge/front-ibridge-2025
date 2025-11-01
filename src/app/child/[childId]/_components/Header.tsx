'use client';

import { useRouter } from 'next/navigation';
import { type ReactNode } from 'react';
import Image from 'next/image';
import { useChildStore } from '@/store/useChildStore';

// --- 아이콘 컴포넌트들 (Named Export) ---
export const BackIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="40" rx="10" fill="#FFE9E0" />
    <path
      d="M17.75 26.75H14.75C14.3522 26.75 13.9706 26.592 13.6893 26.3107C13.408 26.0294 13.25 25.6478 13.25 25.25V14.75C13.25 14.3522 13.408 13.9706 13.6893 13.6893C13.9706 13.408 14.3522 13.25 14.75 13.25H17.75"
      stroke="#FF6B31"
      stroke-width="1.875"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M23 23.75L26.75 20L23 16.25"
      stroke="#FF6B31"
      stroke-width="1.875"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M26.75 20H17.75"
      stroke="#FF6B31"
      stroke-width="1.875"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
export const CloseIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="40" rx="12" fill="white" />
    <path
      d="M26 13.998L14 25.998"
      stroke="#FF6B31"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 13.998L26 25.998"
      stroke="#FF6B31"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export const ChatHistoryIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.303 19.9547C10.052 19.8694 8.829 19.5452 7.7 18.9997L3 19.9997L4.3 16.0997C1.976 12.6627 2.874 8.22772 6.4 5.72572C9.926 3.22472 14.99 3.42972 18.245 6.20572C19.975 7.68172 20.91 9.64072 21.005 11.6387"
      stroke="#4E5968"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 16.8202V18.3242L19 19.3242M14 18.3242C14 19.3851 14.4214 20.4025 15.1716 21.1526C15.9217 21.9028 16.9391 22.3242 18 22.3242C19.0609 22.3242 20.0783 21.9028 20.8284 21.1526C21.5786 20.4025 22 19.3851 22 18.3242C22 17.2634 21.5786 16.2459 20.8284 15.4958C20.0783 14.7456 19.0609 14.3242 18 14.3242C16.9391 14.3242 15.9217 14.7456 15.1716 15.4958C14.4214 16.2459 14 17.2634 14 18.3242Z"
      stroke="#4E5968"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// --- 메인 헤더 전용 컴포넌트들 (Named Export) ---
export const ChildName = () => {
  const { childName } = useChildStore();
  return (
    <p className="text-xl font-extrabold leading-[160%] text-grayscale-gray80">
      {childName}
    </p>
  );
};

export const GrapeInfo = () => {
  const { grapeBunches, grapePieces } = useChildStore();
  return (
    <div className="flex items-center gap-5 text-sm font-semibold text-grayscale-gray70">
      <div className="flex items-center gap-1">
        <Image
          src="/images/grape-bunch-icon.webp"
          alt="포도송이"
          width={24}
          height={24}
        />
        <span>{grapeBunches}송이</span>
      </div>
      <div className="flex items-center gap-1">
        <Image
          src="/images/grape-icon.webp"
          alt="포도알"
          width={24}
          height={24}
        />
        <span>{grapePieces}알</span>
      </div>
    </div>
  );
};

// --- 조합형 Header 컴포넌트 타입 정의 ---
type HeaderProps = {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  className?: string;
};

/**
 * 모든 페이지에서 재사용 가능한 조합형 헤더 컴포넌트 (Default Export)
 */
export default function Header({
  left,
  center,
  right,
  className,
}: HeaderProps) {
  const router = useRouter();

  const defaultLeft = (
    <button onClick={() => router.back()} aria-label="뒤로가기">
      <BackIcon />
    </button>
  );

  return (
    <header
      className={`w-full h-16 px-10 flex items-center fixed top-0 z-50 bg-transparent text-grayscale-gray-80 ${className}`}
    >
      {/* ✅ [수정] 레이아웃을 원래 코드와 거의 동일하게 단순화했습니다. */}
      <div className="w-full max-w-[1260px] mx-auto flex items-center justify-between relative">
        {/* 왼쪽 영역 */}
        <div>
          {left === null ? null : left !== undefined ? left : defaultLeft}
        </div>

        {/* 중앙 영역 (필요할 때만 표시됨) */}
        <div className="absolute left-1/2 -translate-x-1/2">{center}</div>

        {/* 오른쪽 영역 */}
        <div className="flex items-center space-x-2">{right}</div>
      </div>
    </header>
  );
}
