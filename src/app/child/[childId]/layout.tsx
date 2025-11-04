import type { ReactNode } from 'react';
import HydrateChildStore from './hydrate/HydrateChildStore';
import { Fetcher, type ApiResponse } from '@/lib/fetcher';
import { redirect } from 'next/navigation';

type HomeData = {
  childName: string;
  grapeBunches: number;
  grapePieces: number;
  rewardAvailable: boolean;
  emotion: number;
  emotionDone: boolean;
  specifiedDone: boolean;
};
type Overview = HomeData;
type Params = { childId: string };

function redirectToLogin(childId: string): never {
  redirect(`/login?next=/child/${childId}/home`);
}

async function getOverview(childId: string): Promise<Overview> {
  try {
    const res: ApiResponse<HomeData> = await Fetcher<HomeData>(
      `/child/${childId}/home`,
      { method: 'GET' },
    );
    if (res.isSuccess && res.data) return res.data;
    throw new Error('Failed to fetch overview data or data is missing');
  } catch (e: unknown) {
    console.warn('getOverview error:', e);
    redirectToLogin(childId); // never 반환
  }
}

export default async function ChildLayout({
  children,
  params,
}: {
  children: ReactNode;
  // ✅ Promise만 받도록 타입 고정 (union 제거)
  params: Promise<Params>;
}) {
  // ✅ Next가 요구하는 방식: params를 await
  const { childId } = await params;
  const overview = await getOverview(childId);

  return (
    <HydrateChildStore overview={overview}>
      <div className=" select-none ">{children}</div>
    </HydrateChildStore>
  );
}
