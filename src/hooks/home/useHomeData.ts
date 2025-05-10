'use client'

import { useEffect, useState, useCallback } from 'react';
import { useDateStore } from '@/store/date/dateStore';
import { Fetcher } from '@/lib/fetcher'; 
import { useParams } from "next/navigation";

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

  const fetchHomeData = useCallback(async () => {
    if (!selectedDate || !childId) return;

    setLoading(true);

    try {
      const res = await Fetcher<HomeData>(`/parent/${childId}/home?date=${selectedDate}`);
      
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
      console.error("API 호출 오류:", err);
      setSubjects(null);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, childId]);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  return { subjects, loading, refetch: fetchHomeData };
}
