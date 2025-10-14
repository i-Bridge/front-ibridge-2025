'use client';

import Image from 'next/image'; // ✅ Image 컴포넌트 임포트

type Props = {
  emotionDone: boolean;
  rewardAvailable: boolean;
};

export default function DashboardCards({
  emotionDone,
  rewardAvailable,
}: Props) {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* 감정 상태 카드 */}
      {/* ✅ [수정] 보상 카드와 디자인 통일성을 위해 동일한 스펙을 적용합니다. */}
      <div className="bg-secondary/10 h-[284px] rounded-[40px] shadow-sm py-10 px-12 flex flex-col justify-between gap-10">
        <div className="flex items-center gap-5">
          <div className="w-[100px] h-[100px] bg-white rounded-full flex-shrink-0 flex items-center justify-center text-5xl">
            🍀
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-lg font-bold leading-[140%] text-gray-500">
              {formattedDate}
            </p>
            <p className="text-2xl font-bold text-gray-800">
              오늘은 <span className="text-green-600">네잎클로버</span> 같은
              날이야
            </p>
          </div>
        </div>

        <button
          disabled={emotionDone}
          className="w-full h-16 rounded-full bg-secondary flex items-center justify-center py-5 px-10 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          <div className="w-full h-8 flex items-center justify-center">
            <p className="text-xl font-extrabold leading-[160%] text-gray-90">
              {emotionDone ? '감정 선택 완료' : '감정 선택하기'}
            </p>
          </div>
        </button>
      </div>

      {/* 보상 카드 */}
      {/* ✅ [수정] Figma 스펙에 맞춰 h-[284px], rounded-[40px], py-10, px-12, gap-10 클래스를 적용합니다. */}
      <div className="bg-purple-100/50 h-[284px] rounded-[40px] shadow-sm py-10 px-12 flex flex-col justify-between gap-10">
        {/* 상단 텍스트 영역 */}
        <div className="flex items-center gap-5">
          <div className="w-[100px] h-[100px] relative">
            <Image
              src="/images/grape-bunch-icon.webp"
              alt="포도송이 보상"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="flex flex-col">
            <p className="text-[28px] font-extrabold leading-[150%] text-gray-90">
              지금 바로
            </p>
            <p className="text-[28px] font-extrabold leading-[150%]">
              <span className="text-purple-600">포도송이 1송이</span>를 받을 수
              있어!
            </p>
          </div>
        </div>

        {/* 하단 버튼 그룹 */}
        <div className="flex w-full gap-3">
          <button
            disabled={!rewardAvailable}
            className="flex-1 h-16 rounded-full bg-purple-600/15 flex items-center justify-center py-5 px-10 disabled:bg-purple-600/5 disabled:cursor-not-allowed transition-colors"
          >
            <div className="h-8 flex items-center justify-center">
              <p className="text-xl font-extrabold leading-[160%] text-purple-600">
                한 송이 받기
              </p>
            </div>
          </button>
          <button
            disabled
            className="flex-1 h-16 rounded-full bg-purple-600 flex items-center justify-center py-5 px-10 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors"
          >
            <div className="h-8 flex items-center justify-center">
              <p className="text-xl font-extrabold leading-[160%] text-white">
                상점 가기
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
