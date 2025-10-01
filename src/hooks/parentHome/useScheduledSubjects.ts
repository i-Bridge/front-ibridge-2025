'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Fetcher } from '@/lib/fetcher';
import {ScheduledSubject} from '@/types/index';

interface ScheduledSubjectsData {
  subjects: ScheduledSubject[];
}

export function useScheduledSubjects() {
  const { childId } = useParams();
  const [subjects, setSubjects] = useState<ScheduledSubject[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchScheduledSubjects = useCallback(async () => {
    if (!childId) return;

    setLoading(true);
    try {
      const res = await Fetcher<ScheduledSubjectsData>(`/parent/${childId}/scheduled`);
      const scheduledSubjectdata= res?.data;

      console.log("scheduled subjects 호출함",scheduledSubjectdata);
      
      if (scheduledSubjectdata?.subjects) {
        setSubjects(scheduledSubjectdata.subjects);
      } else {
        setSubjects([]);
      }
    } catch (err) {
      console.error('Scheduled subjects fetch error:', err);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  }, [childId]);

  // childId가 바뀌면 fetch
  useEffect(() => {
    fetchScheduledSubjects();
  }, [fetchScheduledSubjects]);

  return { subjects, loading, refetch: fetchScheduledSubjects };
}
