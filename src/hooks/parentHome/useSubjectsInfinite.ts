/*
 * 파일 경로: src/hooks/parentHome/useSubjectsInfinite.ts
 * (이 코드로 덮어쓰세요)
 */
'use client';

import { useState, useCallback } from 'react';
import { Fetcher } from '@/lib/fetcher';
import { Subject } from '@/types/index';
import { useParams, useRouter } from 'next/navigation'; // [NEW] useRouter 임포트
import { useSubjectStore } from '@/store/useSubjectStore'; // [NEW] useSubjectStore 임포트

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

  // [NEW] 페이지 이동 및 상태 설정을 위한 훅
  const router = useRouter();
  const setSelectedSubjectId = useSubjectStore(
    (state) => state.setSelectedSubjectId,
  );

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

          // [NEW] 호출 성공 시, 스토어에 subjectId를 설정하고 페이지 이동
          if (res?.isSuccess && childId) {
            // 1. answerlog 페이지가 인식할 수 있도록 전역 상태 설정
            setSelectedSubjectId(subjectId);
            // 2. answerlog 페이지로 사용자 이동
            router.push(`/parent/${childId}/answerLog`);
          }
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
    // [MODIFIED] 의존성 배열에 훅 추가
    [childId, pageCache, setSelectedSubjectId, router],
  );

  // 다음 페이지 로드
  const loadNext = useCallback(
    async (noticeId?: number, subjectId?: number) => {
      if (loading || !hasNext) return;

      const nextPage = page + 1;

      // noticeId, subjectId가 없으면 무조건 home 호출
      const subjects =
        noticeId && subjectId
          ? await loadPage(nextPage, noticeId, subjectId)
          : await loadPage(nextPage); // home 호출

      // [MODIFIED] pressNotice 호출 시에는 페이지 이동이 우선이므로,
      // allSubjects에 굳이 추가하지 않을 수 있습니다. (home 로직만 추가)
      if (!noticeId && !subjectId) {
        setAllSubjects((prev) => [...prev, ...subjects]);
        setPage(nextPage);
      }
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