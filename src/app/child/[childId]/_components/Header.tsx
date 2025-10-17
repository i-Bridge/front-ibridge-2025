'use client';

import { useRouter } from 'next/navigation';
import { type ReactNode } from 'react';
import Image from 'next/image';
import { useChildStore } from '@/store/useChildStore';

// --- 아이콘 컴포넌트들 (Named Export) ---
export const BackIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" fill="white" />
    <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" stroke="#E2E7EB" />
    <path
      d="M10.6665 17.334H14.6665V21.334"
      stroke="#4E5968"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21.3335 14.666H17.3335V10.666"
      stroke="#4E5968"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.3335 14.6667L22.0002 10"
      stroke="#4E5968"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 22.0007L14.6667 17.334"
      stroke="#4E5968"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
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
export const SettingsIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="40" rx="12" fill="white" />
    <g clipPath="url(#clip0_146_7029)">
      <path
        d="M20 30C25.5228 30 30 25.5228 30 20C30 14.4772 25.5228 10 20 10C14.4772 10 10 14.4772 10 20C10 25.5228 14.4772 30 20 30Z"
        stroke="#4E5968"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 14V20L24 22"
        stroke="#4E5968"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_146_7029">
        <rect width="24" height="24" fill="white" transform="translate(8 8)" />
      </clipPath>
    </defs>
  </svg>
);

// --- 메인 헤더 전용 컴포넌트들 (Named Export) ---
export const ChildName = () => {
  const { childName } = useChildStore();
  return (
    <p className="text-xl font-extrabold leading-[160%] text-gray-800">
      {childName}
    </p>
  );
};

export const GrapeInfo = () => {
  const { grapeBunches, grapePieces } = useChildStore();
  return (
    <div className="flex items-center gap-5 text-sm font-semibold text-gray-700">
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
      className={`w-full h-16 px-10 flex items-center fixed top-0 z-50 bg-transparent text-gray-800 ${className}`}
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
