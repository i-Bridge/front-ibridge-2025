'use client';

import { useChildStore } from '@/store/useChildStore';
import Image from 'next/image';

export default function Header() {
  // ✅ [수정] 스토어에서 직접 grapeBunches와 grapePieces를 가져옵니다.
  const { childName, grapeBunches, grapePieces } = useChildStore();

  return (
    <header className="w-full h-16 bg-white shadow-sm px-10 flex items-center">
      <div className="w-full max-w-[1260px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-xl font-extrabold leading-[160%] text-gray-800">
            {childName}
          </p>
        </div>

        <div className="flex items-center gap-5 text-sm font-semibold text-gray-700">
          <div className="flex items-center gap-1">
            <Image
              src="/images/grape-bunch-icon.webp"
              alt="포도송이"
              width={24}
              height={24}
              quality={100}
            />
            {/* ✅ [수정] 스토어에서 가져온 grapeBunches 값을 바로 사용합니다. */}
            <span>{grapeBunches}송이</span>
          </div>
          <div className="flex items-center gap-1">
            <Image
              src="/images/grape-icon.webp"
              alt="포도알"
              width={24}
              height={24}
              quality={100}
            />
            {/* ✅ [수정] 스토어에서 가져온 grapePieces 값을 바로 사용합니다. */}
            <span>{grapePieces}알</span>
          </div>
        </div>
      </div>
    </header>
  );
}
