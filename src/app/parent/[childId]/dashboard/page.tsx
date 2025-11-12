import { Fetcher } from '@/lib/api/fetcher';
import AiComment from './_components/AiComment';
import { ChildPageParams } from '@/types/page-props';
import NotFound from '@/components/Exception/not-found';
import PageLayout from '@/app/parent/[childId]/_components/Layout/ParentLayout';
import { Text } from '@/ui/Text';
import CumulateChart from '@/app/parent/[childId]/dashboard/_components/CumulateChart';
import CategoryRankChart from './_components/CategoryChart';
import { Category, BannerResponse, ApiError } from '@/types';
import { serverApi } from '@/lib/api/serverFetcher';
import { formatDateWithDay } from '@/hooks/formatDateWithDay';
interface KeywordData {
  categories: Category[]; // 키워드 배열
}

interface CumulativeData {
  cumulative: number; // 누적 응답 수
  cumList: number[]; // 일별 응답 수 (오늘 포함 7일)
}

export default async function DashBoardPage({ params }: ChildPageParams) {
  // params가 Promise이므로, await를 사용해 값을 추출
  const { childId } = await params;

  if (!childId) return <NotFound message="자녀 ID가 존재하지 않습니다." />;

  let banners: BannerResponse | null = null;
  let bannerError: string | null = null;

  try {
    // ⭐️ try 블록 안에서 댓글 API를 호출합니다.
    banners = await serverApi.get<BannerResponse>(`/parent/${childId}/banner`);
  } catch (error) {
    // ⭐️ catch 블록에서 에러를 잡습니다.
    console.error('댓글 로딩 실패:', error);

    // 에러가 ApiError 타입인지 확인하여 사용자에게 보여줄 메시지를 설정합니다.
    if (error instanceof ApiError) {
      bannerError = `배너를 불러오지 못했습니다. (${error.message})`;
    } else {
      bannerError = '배너를 불러오는 중 알 수 없는 오류가 발생했습니다.';
    }
  }
  const keywordRes = await Fetcher<KeywordData>(`/parent/${childId}/categories`);
  const keywordData = keywordRes.data;
  console.log('분석 /categories api 호출 ', keywordRes);
  if (!keywordData) {
    return <div>분석 데이터 불러오기 실패...</div>;
  }

  const cumulativeRes = await Fetcher<CumulativeData>(
    `/parent/${childId}/stat/cumulative?periodType='day'`,
  );
  const cumulativeData = cumulativeRes.data;
  console.log(
    "분석 /stat/cumulative?periodType='day' api 호출 ",
    cumulativeRes,
  );
  if (!cumulativeData) {
    return <div>분석 데이터 불러오기 실패...</div>;
  }

  const pageTitle = (
    <>
      {banners?.date ? (
        <Text variant={'body03'} className="text-grayscale-gray60">
          {formatDateWithDay(banners.date)} 업데이트됨
        </Text>
      ) : (
        <Text variant={'body03'} className="text-grayscale-gray60">
          정보 업데이트를 위해 자녀의 답변 기록이 더 필요합니다.
        </Text>
      )}

      <Text variant={'title01'}>
        {' '}
        아이가 자주 느낀
        <br />
        감정들을 들여다볼까요?
      </Text>
    </>
  );

  return (
    <PageLayout title={pageTitle}>
      {/* 헤더에 알림 개수 정보 전달 필요 */}
      <AiComment bannerData={banners} bannerError={bannerError} />

      <CumulateChart
        childId={childId}
        cumulative={cumulativeData.cumulative}
        defaultCumList={cumulativeData.cumList}
      />

      <CategoryRankChart categories={keywordData.categories} />
    </PageLayout>
  );
}
