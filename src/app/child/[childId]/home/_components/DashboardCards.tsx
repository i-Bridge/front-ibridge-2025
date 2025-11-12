'use client';

import Image from 'next/image';
import { Text } from '@/ui/Text';
import { Button } from '@/ui/Button';
import { EMOTION_BY_ID, isEmotionId } from '@/constants/emotions';
import { DotWaves } from '@/ui/loading/DotWaves';
import CustomCard from '@/ui/CustomCard'; // CustomCard import 확인

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
  const formattedDate = `${today.getFullYear()}년 ${
    today.getMonth() + 1
  }월 ${today.getDate()}일`;
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
    <div className="w-full self-stretch flex gap-5">
      {/* [수정] 감정 상태 카드: CustomCard로 변경 */}
      <CustomCard className="flex-1 bg-secondary-secondaryMedium  gap-7 rounded-[40px]">
        {/* 상단 영역 */}
        
        <div className="w-full self-stretch flex flex-col justify-center items-start gap-5">
          <div className="inline-flex justify-start items-center gap-5">
            {/* 감정 아이콘 */}
            <div className="w-20 h-20 relative rounded-[40px] overflow-hidden flex items-center justify-center">
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
              <Text variant={'body04'} className="text-grayscale-gray90 ">
                {formattedDate}
              </Text>

              {emotionDone ? (
                <div>
                  <Text
                    as="span"
                    variant={'caption02'}
                    className="text-grayscale-gray90"
                  >
                    오늘은{' '}
                  </Text>
                  <Text
                    as="span"
                    variant={'caption02'}
                    className="text-primary-primary"
                  >
                    {currentEmotion?.labelKo ?? '특별한'}
                  </Text>
                  <Text
                    as="span"
                    variant={'caption02'}
                    className="text-grayscale-gray90 "
                  >
                    {' '}
                    날이야
                  </Text>
                </div>
              ) : (
                <div className="">
                  <Text as='span' variant={'caption02'} className="text-primary-primary">
                    오늘의 감정
                  </Text>
                  <Text as='span' variant={'caption02'} className="text-grayscale-gray90">
                    을 알려줘!
                  </Text>
                </div>
              )}
            </div>
          </div>
        </div>
        

        {/* 버튼 영역 */}
        <Button
          onClick={onEmotionSelectClick}
          disabled={emotionDone}
          className=" w-full bg-secondary-secondary h-14"
          textVariant="caption03"
          textClass="text-grayscale-gray90 "
        >
          {emotionDone ? '감정 선택 완료' : '감정 선택하기'}
        </Button>
      </CustomCard>

      {/* 보상 카드 (기존과 동일) */}
      <CustomCard className="w-full self-stretch flex-1 bg-other-purple-light gap-7 rounded-[40px]">
        <div className="w-full self-stretch inline-flex justify-start items-center gap-5">
          <div className="w-20 h-20 relative">
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
          <div className="inline-flex flex-col justify-center items-start">
            {rewardAvailable ? (
              <>
                <Text variant={'caption02'} className=" text-grayscale-gray90">
                  지금 바로
                </Text>
                <Text variant={'caption02'} className="text-grayscale-gray90">
                  <Text
                    as="span"
                    variant={'caption02'}
                    className="text-other-purple"
                  >
                    포도송이
                  </Text>
                  를 받을 수 있어!
                </Text>
              </>
            ) : (
              <>
                <Text variant={'caption02'} className="">
                  <Text
                    as="span"
                    variant={'caption02'}
                    className="text-other-purple"
                  >
                    {grapesNeeded}알
                  </Text>{' '}
                  더 모으면
                </Text>
                <Text variant={'caption02'} className="text-grayscale-gray90">
                  포도송이를 받을 수 있어!
                </Text>
              </>
            )}
          </div>
        </div>

        <div className="flex w-full gap-3 ">
          <Button
            onClick={onClaimReward}
            disabled={!rewardAvailable || isClaiming}
            className="w-full bg-other-purple h-14"
            textVariant={'caption03'}
            textClass="text-white"
          >
            {isClaiming ? <DotWaves /> : '한 송이 받기'}
          </Button>

          <Button
            disabled={true}
            className=" w-full bg-other-purple/15 h-14"
            textVariant={'caption03'}
            textClass="text-other-purple"
          >
            상점 준비 중
          </Button>
        </div>
      </CustomCard>
    </div>
  );
}
