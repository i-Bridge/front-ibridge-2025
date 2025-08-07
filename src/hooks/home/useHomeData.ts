//childId, selectedDate 달라지면 실행됨
//해당 날짜의 subject 제목 정보 호출 및 캐시 관리

'use client';
import { useEffect, useState, useCallback } from 'react';
import { useDateStore } from '@/store/useDateStore';
import { Fetcher } from '@/lib/fetcher';
import { useParams } from 'next/navigation';

type Subject = {
  subjectId: number;
  subjectTitle: string;
  answer: boolean;
};

interface HomeData {
  noticeCount: {
    noticeExist: boolean;
  };
  subjects: Subject[];
}

const cache = new Map<string, Subject[]>();
const MAX_CACHE_SIZE = 5;

export function useHomeData() {
  const { selectedDate } = useDateStore();
  const [subjects, setSubjects] = useState<Subject[] | null>(null);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const childId = params?.childId;

  // ✅ childId, selectedDate 달라지면 실행됨
  // ✅ 제목 편집 시 refetch 위해 useCallback으로 
  const fetchHomeData = useCallback(async () => {
    if (!selectedDate || !childId) return;
    setLoading(true);

    try {
      const res = await Fetcher<HomeData>(
        `/parent/${childId}/home?date=${selectedDate}`,
      );

      if (res && res.data) {
        const { subjects } = res.data;
        setSubjects(subjects);
        cache.set(selectedDate, subjects);

        if (cache.size > MAX_CACHE_SIZE) {
          const firstKey = cache.keys().next().value;
          if (firstKey !== undefined) {
            cache.delete(firstKey);
          }
        }
      }
    } catch (err) {
      console.error('API 호출 오류:', err);
      setSubjects(null);
    } finally {
      setLoading(false);
    }
  }, [childId, selectedDate]);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  return { subjects, loading, refetch: fetchHomeData };
}
