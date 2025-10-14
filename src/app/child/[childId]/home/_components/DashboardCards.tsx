'use client';

import Image from 'next/image';

// ✅ [수정] Props 타입에서 rewardAvailable를 제거합니다.
type Props = {
  emotionDone: boolean;
  grapes: number;
};

export default function DashboardCards({ emotionDone, grapes }: Props) {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  // ✅ [추가] 포도송이를 받을 수 있는지 여부(isRewardAvailable)를 grapes 값에 따라 직접 계산합니다.
  // 포도알이 0보다 크고 6으로 나누어 떨어질 때 '한 송이 받기'가 활성화됩니다.
  const isRewardAvailable = grapes > 0 && grapes % 6 === 0;

  // ✅ [추가] 아이콘에 표시할 낱알 개수를 계산하는 로직입니다.
  // 6, 12, 18개 등 6의 배수일 때는 꽉 찬 포도송이(6개) 아이콘을 보여주고,
  // 그 외에는 나머지 낱알 개수를 보여줍니다.
  const remainder = grapes % 6;
  const displayGrapes = isRewardAvailable ? 6 : remainder;

  const getGrapeIconPath = (count: number) => {
    const grapeCount = Math.max(0, Math.min(6, count));
    // ✅ [수정] 파일 확장자를 .webp로 변경하여 일관성을 맞춥니다.
    return `/images/grape-bunch-${grapeCount}.webp`;
  };

  const grapeIconSrc = getGrapeIconPath(displayGrapes);

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
        {/* 상단 텍스트 영역 */}
        <div className="flex items-center gap-5">
          <div className="w-[100px] h-[100px] relative">
            <Image
              src={grapeIconSrc}
              alt={`포도알 ${displayGrapes}개`}
              fill
              style={{ objectFit: 'contain' }}
              quality={100}
              // ✅ [추가] fill 속성 사용 시, 브라우저가 화면 너비에 맞는 최적의 이미지를 선택하도록 sizes 정보를 제공합니다.
              // 이 이미지는 항상 100px 너비의 컨테이너 안에 있으므로 '100px'로 설정합니다.
              sizes="100px"
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
            // ✅ [수정] '한 송이 받기' 버튼의 disabled 조건을 내부에서 계산한 isRewardAvailable로 변경합니다.
            disabled={!isRewardAvailable}
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
