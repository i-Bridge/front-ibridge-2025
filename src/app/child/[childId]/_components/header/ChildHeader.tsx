'use client';

import { useRouter } from 'next/navigation';
import { type ReactNode } from 'react';
import { useChildStore } from '@/store/useChildStore';
import { Text } from '@/ui/Text';
import { BackIcon, GrapeIcon, GrapeBunchIcon } from '@/ui/icon/icon';
// --- 아이콘 컴포넌트들 (Named Export) ---

// --- 메인 헤더 전용 컴포넌트들 (Named Export) ---
export const ChildName = () => {
  const { childName } = useChildStore();
  return <Text variant={'caption02'}>{childName}</Text>;
};

export const GrapeInfo = () => {
  const { grapeBunches, grapePieces } = useChildStore();
  return (
    <div className="flex items-center gap-5">
      <div className="inline-flex justify-start items-center gap-1">
        <GrapeBunchIcon />
        <Text variant={'caption03'}>{grapeBunches}송이</Text>
      </div>
      <div className="inline-flex justify-start items-center gap-1">
        <GrapeIcon />
        <Text variant={'caption03'}>{grapePieces}알</Text>
      </div>
    </div>
  );
};

export const BackButton = () => {
  const router = useRouter();

  return (
    <button onClick={() => router.back()} aria-label="뒤로가기">
      <BackIcon />
    </button>
  );
};

// --- 조합형 Header 컴포넌트 타입 정의 ---
type HeaderProps = {
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
};

/**
 * 모든 페이지에서 재사용 가능한 조합형 헤더 컴포넌트 (Default Export)
 */
export default function ChildHeaderLayout({
  left,
  right,
  className,
}: HeaderProps) {
  return (
    <div
      className={`w-full self-stretch h-16 px-10 inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden ${className}`}
    >
      <div className="w-full max-w-[1260px] mx-auto flex items-center justify-between relative">
        <div className="inline-flex justify-start items-center gap-3">
          {' '}
          {left}{' '}
        </div>

        <div className="inline-flex justify-start items-center gap-3">
          {' '}
          {right}
        </div>
      </div>
    </div>
  );
}
