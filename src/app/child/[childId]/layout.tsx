import type { ReactNode } from 'react';
import HydrateChildStore from './hydrate/HydrateChildStore';
import { Fetcher, type ApiResponse } from '@/lib/fetcher';

type HomeData = {
  childName: string;
  grapes: number;
  emotion: number; // 어떤 감정을 선택했는지
  emotionDone: boolean; // 감정 선택을 완료했는지
  specifiedDone: boolean; // 지정 질문을 완료했는지
};

type Overview = {
  childName: string;
  grapes: number;
  emotion: number;
  emotionDone: boolean;
  specifiedDone: boolean;
};

type Params = { childId: string };

async function getOverview(childId: string): Promise<Overview> {
  const res: ApiResponse<HomeData> = await Fetcher<HomeData>(
    `/child/${childId}/home`,
    { method: 'GET' },
  );

  if (res.isSuccess && res.data) {
    console.log(res.data);
    const { childName, grapes, emotion, emotionDone, specifiedDone } = res.data;
    return {
      childName,
      grapes,
      emotion,
      emotionDone,
      specifiedDone,
    };
  } else {
    // API 호출은 성공했으나, isSuccess가 false이거나 데이터가 없는 경우 에러를 발생시킵니다.
    throw new Error('Failed to fetch overview data or data is missing');
  }
}

export default async function ChildLayout({
  children,

  params,
}: {
  children: ReactNode;
  params: Promise<Params>;
}) {
  const { childId } = await params;

  const overview = await getOverview(childId);

  return (
    <HydrateChildStore overview={overview}>
      <div className="select-none">{children}</div>
    </HydrateChildStore>
  );
}
