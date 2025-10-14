'use client';

import { useChildStore } from '@/store/useChildStore';
import Image from 'next/image';

export default function Header() {
  const { childName, grapes } = useChildStore();

  const grapeBunches = Math.floor(grapes / 6);
  const individualGrapes = grapes % 6;

  return (
    <header className="w-full h-16 bg-white shadow-sm px-10 flex items-center">
      <div className="w-full max-w-[1260px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-xl font-extrabold leading-[160%] text-gray-800">
            {childName}
          </p>
        </div>

        {/* ✅ [수정] Figma 스펙에 맞춰 각 요소의 간격을 조정합니다. */}
        {/* 전체 재화 컨테이너: gap-5 (20px) */}
        <div className="flex items-center gap-5 text-sm font-semibold text-gray-700">
          {/* 포도송이: gap-1 (4px) */}
          <div className="flex items-center gap-1">
            <Image
              src="/images/grape-bunch-icon.webp"
              alt="포도송이"
              width={24}
              height={24}
              quality={100}
            />
            <span>{grapeBunches}송이</span>
          </div>
          {/* 포도알: gap-1 (4px) */}
          <div className="flex items-center gap-1">
            <Image
              src="/images/grape-icon.webp"
              alt="포도알"
              width={24}
              height={24}
              quality={100}
            />
            <span>{individualGrapes}알</span>
          </div>
        </div>
      </div>
    </header>
  );
}
