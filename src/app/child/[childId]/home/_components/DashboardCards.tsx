'use client';

import Image from 'next/image';
import { EMOTION_BY_ID, isEmotionId } from '@/constants/emotions';

type Props = {
  emotionDone: boolean;
  rewardAvailable: boolean;
  grapePieces: number;
  onEmotionSelectClick: () => void;
  onClaimReward: () => void;
  isClaiming: boolean; // "한 송이 받기" 로딩 상태
  emotion: number;
};

export default function DashboardCards({
  emotionDone,
  rewardAvailable,
  grapePieces,
  onEmotionSelectClick,
  onClaimReward,
  isClaiming,
  emotion,
}: Props) {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
  const grapesNeeded = 6 - grapePieces;

  const getGrapeIconPath = (count: number) => {
    const grapeCount = Math.max(0, Math.min(6, count));
    return `/images/grape-bunch-${grapeCount}.webp`;
  };

  const grapeIconSrc = getGrapeIconPath(grapePieces);
  const currentEmotion =
    typeof emotion === 'number' && isEmotionId(emotion)
      ? EMOTION_BY_ID[emotion]
      : undefined;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* 감정 상태 카드 */}
      <div className="p-10 bg-secondary-secondaryMedium rounded-[40px] inline-flex flex-col justify-center items-start gap-7 overflow-hidden">
        {/* 상단 영역 */}
        <div className="w-full flex flex-col justify-center items-start gap-5">
          <div className="inline-flex justify-start items-center gap-5">
            {/* 아이콘/빈상태 썸네일 */}
            <div
              className={[
                'w-20 h-20 relative rounded-[40px] overflow-hidden flex items-center justify-center',
                // 미선택 상태: 배경+아웃라인 노출
                !emotionDone
                  ? 'bg-secondary-secondaryLight outline outline-[2.5px] outline-offset-[-1.25px] outline-primary-primary'
                  : 'bg-transparent outline-none',
              ].join(' ')}
            >
              {emotionDone && currentEmotion ? (
                <currentEmotion.icon className="w-20 h-20" />
              ) : (
                <Image
                  src="/images/emotion-blank.webp"
                  alt="감정 선택 전"
                  fill
                  style={{ objectFit: 'contain' }}
                  sizes="80px"
                  priority={false}
                />
              )}
            </div>

            {/* 날짜 + 문구 */}
            <div className="inline-flex flex-col justify-center items-start gap-2">
              <div className="text-grayscale-gray90 text-base leading-6">
                {formattedDate}
              </div>

              {emotionDone ? (
                <div className="inline-flex justify-start items-center">
                  <div className="text-grayscale-gray90 text-xl font-extrabold leading-8">
                    오늘은{' '}
                  </div>
                  <div className="text-primary-primary text-xl font-extrabold leading-8">
                    {currentEmotion?.labelKo ?? '특별한'}
                  </div>
                  <div className="text-grayscale-gray90 text-xl font-extrabold leading-8">
                    {' '}
                    날이야
                  </div>
                </div>
              ) : (
                <div className="inline-flex justify-start items-center">
                  <div className="text-primary-primary text-xl font-extrabold leading-8">
                    오늘의 감정
                  </div>
                  <div className="text-grayscale-gray90 text-xl font-extrabold leading-8">
                    을 알려줘!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <button
          onClick={onEmotionSelectClick}
          disabled={emotionDone}
          className="w-full h-16 rounded-full bg-secondary-secondary flex items-center justify-center py-5 px-10 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          <div className="w-full text-center text-grayscale-gray90 text-base font-extrabold leading-6">
            {emotionDone ? '감정 선택 완료' : '감정 선택하기'}
          </div>
        </button>
      </div>

      {/* 보상 카드 */}
      <div className="bg-other-purple-light h-[284px] rounded-[40px] py-10 px-12 flex flex-col justify-between gap-10">
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
            {rewardAvailable ? (
              <>
                <p className="text-[28px] font-extrabold leading-[150%] text-grayscale-gray90">
                  지금 바로
                </p>
                <p className="text-[28px] font-extrabold leading-[150%]">
                  <span className="text-purple">포도송이</span>를 받을 수 있어!
                </p>
              </>
            ) : (
              <>
                <p className="text-[28px] font-extrabold leading-[150%]">
                  <span className="text-purple">{grapesNeeded}알</span> 더
                  모으면
                </p>
                <p className="text-[28px] font-extrabold leading-[150%] text-grayscale-gray90">
                  포도송이를 받을 수 있어!
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex w-full gap-3">
          <button
            onClick={onClaimReward}
            disabled={!rewardAvailable || isClaiming}
            className="flex-1 h-16 rounded-full bg-other-purple flex items-center justify-center py-5 px-10 disabled:opacity-15 disabled:cursor-not-allowed transition-all"
          >
            <div className="h-8 flex items-center justify-center">
              {isClaiming ? (
                <div className="flex gap-1.5 justify-center items-center">
                  <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"></span>
                </div>
              ) : (
                <div className="h-8 flex items-center justify-center">
                  <p className="text-base font-extrabold leading-6 text-white">
                    한 송이 받기
                  </p>
                </div>
              )}
            </div>
          </button>

          <button
            disabled
            // ✅ [수정] 'disabled:bg-purple/15'와 'text-purple-600'을 'disabled:opacity-15'로 변경하여 버튼 전체에 투명도를 적용합니다.
            className="flex-1 h-16 rounded-full bg-other-purple/15 flex items-center justify-center py-5 px-10 disabled:opacity-15 cursor-not-allowed transition-all"
          >
            <div className="h-8 flex items-center justify-center">
              <p className="text-base font-extrabold leading-6 text-other-purple">
                상점 준비 중
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
