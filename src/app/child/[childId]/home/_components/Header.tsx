'use client';

import { useChildStore } from '@/store/useChildStore'; // 스토어 경로를 확인해주세요.

export default function Header() {
  // Zustand 스토어에서 직접 필요한 데이터를 가져옵니다.
  const { childName, grapes } = useChildStore();

  return (
    <header className="w-full bg-white shadow-sm p-4 flex justify-between items-center">
      <div className="text-lg font-bold text-gray-700">{childName}</div>
      <div className="flex items-center gap-4 text-sm">
        <span className="font-semibold text-blue-500">🍇 {grapes}개</span>
      </div>
    </header>
  );
}
