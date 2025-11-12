import CustomCard from '@/ui/CustomCard';
import { Text } from '@/ui/Text';
import AiCommentSkeleton from './AIBannerSkeleton';
import { Suspense } from 'react';
import { BannerResponse } from '@/types';

interface AiBannerProps{
  bannerData: BannerResponse | null;
  bannerError: string | null;
}

export default async function AiComment({ bannerData, bannerError}: AiBannerProps) {
  if( bannerError || !bannerData ) {
    return (
      <div className="w-full self-stretch inline-flex flex-col justify-start items-start gap-5">
        <Text variant={'body04'} className="text-red-600">
          {bannerError}
        </Text>
      </div>
    );
  }

  return (
    <Suspense fallback={<AiCommentSkeleton />}>
      <div className="w-full self-stretch inline-flex flex-col justify-start items-start gap-5">
        {/* 1. 가장 많이 한 이야기 주제 */}
        {/* 피그마 레이아웃에 맞게 h-36 클래스 추가 */}
        <CustomCard className="items-start py-8 bg-secondary-secondaryMedium ">
          <Text variant={'body04'} className="text-black/60">
            가장 많이 한 이야기 주제
          </Text>
          <Text
            variant={'caption01'}
            className={!bannerData.mostTalkedCategory ? 'text-black/50' : ''}
          >
            {bannerData.mostTalkedCategory || '아직 데이터가 없습니다.'}
          </Text>
        </CustomCard>

        {/* 2. 긍정/부정 주제 래퍼 */}
        <div className="w-full self-stretch flex justify-start items-start gap-5">
          {/* 긍정적인 주제 */}
          <CustomCard className="items-start py-8 bg-other-mint-light ">
            <Text variant={'body04'} className="text-black/60">
              긍정적인 주제
            </Text>
            <Text
              variant={'caption01'}
              className={!bannerData.positiveCategory ? 'text-black/50' : ''}
            >
              {bannerData.positiveCategory || '아직 데이터가 없습니다.'}
            </Text>
          </CustomCard>

          {/* 부정적인 주제 */}
          <CustomCard className="items-start py-8 bg-error-errorLight ">
            <Text variant={'body04'} className="text-black/60">
              부정적인 주제
            </Text>
            <Text
              variant={'caption01'}
              className={!bannerData.negativeCategory ? 'text-black/50' : ''}
            >
              {bannerData.negativeCategory || '아직 데이터가 없습니다.'}
            </Text>
          </CustomCard>
        </div>
      </div>
    </Suspense>
  );
}
