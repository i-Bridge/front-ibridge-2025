'use client';

import Link from 'next/link';

// 샘플 데이터 (나중에 API에서 받아올 수도 있음)
const profiles = [
  { childId: 1, parentId: 10 },
  { childId: 2, parentId: 20 },
];

export default function Profile() {
  return (
    <div className="w-full h-screen flex flex-col bg-gray-100">
      {/* 상단: 관리 계정 프로필 */}
      <div className="flex justify-center items-center flex-wrap gap-8 p-8 bg-white border-b">
        {profiles.map(({ childId, parentId }) => (
          <div key={parentId} className="flex flex-col items-center">
            <Link href={`/parent/${parentId}/home`}>
              <div className="w-32 h-32 bg-blue-500 rounded-full hover:ring-4 hover:ring-blue-300 cursor-pointer flex items-center justify-center text-white">
                자식 {childId} 부모 
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* 하단: 자식 계정 프로필 */}
      <div className="flex justify-center items-center flex-wrap gap-8 p-8">
        {profiles.map(({ childId }) => (
          <div key={childId} className="flex flex-col items-center">
            <Link href={`/child/${childId}`}>
              <div className="w-32 h-32 bg-blue-300 rounded-full hover:ring-4 hover:ring-blue-500 cursor-pointer flex items-center justify-center text-white">
                자식 {childId} 계정
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
