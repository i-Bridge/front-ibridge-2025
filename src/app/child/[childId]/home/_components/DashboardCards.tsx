'use client';

import Image from 'next/image';

// ✅ [수정] Props 타입을 새로운 데이터 구조와 로딩 상태에 맞게 업데이트합니다.
type Props = {
  emotionDone: boolean;
  rewardAvailable: boolean;
  grapePieces: number;
  onEmotionSelectClick: () => void;
  onClaimReward: () => void;
  isClaiming: boolean; // "한 송이 받기" 로딩 상태
};

export default function DashboardCards({
  emotionDone,
  rewardAvailable,
  grapePieces,
  onEmotionSelectClick,
  onClaimReward,
  isClaiming,
}: Props) {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  const getGrapeIconPath = (count: number) => {
    const grapeCount = Math.max(0, Math.min(6, count));
    return `/images/grape-bunch-${grapeCount}.webp`;
  };

  // ✅ [수정] prop으로 받은 grapePieces를 직접 사용합니다.
  const grapeIconSrc = getGrapeIconPath(grapePieces);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* 감정 상태 카드 */}
      <div className="bg-secondary/10 h-[284px] rounded-[40px] shadow-lg py-10 px-12 flex flex-col justify-between gap-10">
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
          onClick={onEmotionSelectClick}
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
      <div className="bg-purple-100/50 h-[284px] rounded-[40px] shadow-lg py-10 px-12 flex flex-col justify-between gap-10">
        <div className="flex items-center gap-5">
          <div className="w-[100px] h-[100px] relative">
            <Image
              src={grapeIconSrc}
              alt={`포도알 ${grapePieces}개`}
              fill
              style={{ objectFit: 'contain' }}
              quality={100}
              sizes="100px"
              priority
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
        <div className="flex w-full gap-3">
          <button
            onClick={onClaimReward}
            disabled={!rewardAvailable || isClaiming}
            className="flex-1 h-16 rounded-full bg-purple-600/15 flex items-center justify-center py-5 px-10 disabled:bg-purple-600/5 disabled:cursor-not-allowed transition-colors"
          >
            <div className="h-8 flex items-center justify-center">
              <p className="text-xl font-extrabold leading-[160%] text-purple-600">
                {isClaiming ? '처리 중...' : '한 송이 받기'}
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
