import type { ReactNode } from 'react';
import HydrateChildStore from './hydrate/HydrateChildStore';
import { Fetcher, type ApiResponse } from '@/lib/fetcher';
import { redirect } from 'next/navigation';

// ✅ [수정] 백엔드의 새로운 API 응답 타입을 정확하게 정의합니다.
type HomeData = {
  childName: string;
  grapeBunches: number;
  grapePieces: number;
  rewardAvailable: boolean;
  emotion: number;
  emotionDone: boolean;
  specifiedDone: boolean;
};

// ✅ [수정] Zustand 스토어에 주입할 데이터 타입도 새로운 구조에 맞게 변경합니다.
// 이 타입은 이제 HomeData와 동일한 구조를 가집니다.
type Overview = HomeData;

type Params = { childId: string };

async function getOverview(childId: string): Promise<Overview> {
  try {
    const res: ApiResponse<HomeData> = await Fetcher<HomeData>(
      `/child/${childId}/home`,
      { method: 'GET' },
    );

    if (res.isSuccess && res.data) {
      console.log('Fetched overview data:', res.data);
      // ✅ [수정] 이제 별도의 가공 없이 받은 데이터를 그대로 반환합니다.
      return res.data;
    } else {
      throw new Error('Failed to fetch overview data or data is missing');
    }
  } catch (error: any) {
    redirect(`/login?next=/child/${childId}/home`);
  }
}

export default async function ChildLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Params | Promise<Params>;
}) {
  const { childId } = await Promise.resolve(params);
  const overview = await getOverview(childId);

  return (
    <HydrateChildStore overview={overview}>
      <div className="select-none">{children}</div>
    </HydrateChildStore>
  );
}
