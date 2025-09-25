// app/child/[childId]/layout.tsx
import type { ReactNode } from 'react';
import ChildShell from './ChildShell';
import HydrateChildStore from './hydrate/HydrateChildStore';
import { redirect } from 'next/navigation';
import { Fetcher, type ApiResponse } from '@/lib/fetcher';

// API가 내려주는 data 형태
type HomeData = {
  emotion: boolean;
  completed: boolean;
  grape: number; // 알 개수
};

type Overview = {
  grapes: number; // 알(원장 단위)
  emotionDone: boolean;
  specifiedDone: boolean;
};

type Params = { childId: string };

async function getOverview(childId: string): Promise<Overview> {
  // ✅ 네가 만든 Fetcher 사용 (서버에서 getServerSession → Authorization 주입)
  try {
    const res: ApiResponse<HomeData> = await Fetcher<HomeData>(
      `/child/${childId}/home`,
      { method: 'GET' },
    );
    console.log('getoverview 호출');
    console.log(`[Layout SSR] /home API 응답 데이터:`, res.data);
    // 백엔드 표준 응답(code/message/isSuccess) 처리
    if (res.isSuccess !== true || !res.data) {
      console.warn('[overview] API logical failure:', res);
      return { grapes: 0, emotionDone: false, specifiedDone: false };
    }

    const { emotion, completed, grape } = res.data;
    return {
      grapes: Number(grape ?? 0),
      emotionDone: !!emotion,
      specifiedDone: !!completed,
    };
  } catch (e: any) {
    // ❗️Fetch 실패/401 등: 로그인 필요로 간주
    // axios 에러든 일반 에러든 여기서 처리
    console.error('[overview] fetch error:', e?.message || e);
    redirect(`/login?next=/child/${childId}/talk`);
  }
}

export default async function ChildLayout({
  children,
  // 최신 Next는 params가 비동기일 수 있음 → 유니온으로 받고 항상 await
  params,
}: {
  children: ReactNode;
  params: Params | Promise<Params>;
}) {
  const { childId } = await Promise.resolve(params);

  const overview = await getOverview(childId);

  // 1) SSR로 overview 로드
  // 2) 클라이언트에서 zustand로 1회 하이드레이트
  // 3) ChildShell에서 pathname 보고 사이드바/HUD 제어
  return (
    <HydrateChildStore overview={overview}>
      <ChildShell>{children}</ChildShell>
    </HydrateChildStore>
  );
}
