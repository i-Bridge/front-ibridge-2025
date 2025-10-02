'use client';

import { useState, useCallback } from 'react';
import { Fetcher } from '@/lib/fetcher';
import { Subject } from '@/types/index';
import { useParams } from 'next/navigation';

interface HomeData {
  hasNext: boolean;
  subjects: Subject[];
}

interface PressNoticeData {
  page: number | undefined;
  hasNext: boolean;
  subjects: Subject[];
}

export function useSubjectsInfinite() {
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [pageCache] = useState<Map<number, Subject[]>>(new Map());
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const childId = params?.childId;

  // 페이지를 로드하는 함수 (home or pressNotice)
  const loadPage = useCallback(
    async (pageNum: number, noticeId?: number, subjectId?: number) => {
      if (pageCache.has(pageNum)) {
        return pageCache.get(pageNum)!;
      }

      setLoading(true);
      try {
        let res;
        let subjects: Subject[] = [];
        if (noticeId && subjectId) {
          // pressNotice API 호출
          res = await Fetcher<PressNoticeData>(
            `/parent/${childId}/pressNotice?subjectId=${subjectId.toString()}&noticeId=${noticeId.toString()}`,
          );
          const pressData = res?.data;
          subjects = pressData?.subjects ?? [];
          pageCache.set(pressData?.page ?? 1, subjects);
          console.log('press notice data', pressData);
        } else {
          // home API 호출
          res = await Fetcher<HomeData>(
            `/parent/${childId}/home?page=${pageNum}`,
          );
          subjects = res?.data?.subjects ?? [];
          pageCache.set(pageNum, subjects);
          console.log('home data', res?.data);
        }

        const next = res?.data?.hasNext ?? false;
        setHasNext(next);

        return subjects;
      } finally {
        setLoading(false);
      }
    },
    [childId, pageCache],
  );

  // 다음 페이지 로드
  const loadNext = useCallback(
  async (noticeId?: number, subjectId?: number) => {
    if (loading || !hasNext) return;

    const nextPage = page + 1;

    // noticeId, subjectId가 없으면 무조건 home 호출
    const subjects = noticeId && subjectId 
      ? await loadPage(nextPage, noticeId, subjectId)
      : await loadPage(nextPage); // home 호출

    setAllSubjects((prev) => [...prev, ...subjects]);
    setPage(nextPage);
  },
  [loading, hasNext, page, loadPage],
);

  // 초기 페이지 세팅
  const initFirstPage = useCallback(
    async (initialSubjects: Subject[]) => {
      if (allSubjects.length > 0) return;
      pageCache.set(0, initialSubjects);
      setAllSubjects(initialSubjects);
      setPage(0);
    },
    [allSubjects.length, pageCache],
  );

  return {
    allSubjects,
    loading,
    loadNext,
    hasNext,
    pageCache,
    initFirstPage,
  };
}
