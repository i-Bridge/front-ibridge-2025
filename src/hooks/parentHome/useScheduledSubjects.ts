'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Fetcher } from '@/lib/api/fetcher';
import { ScheduledSubject } from '@/types/index';

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
      const res = await Fetcher<ScheduledSubjectsData>(
        `/parent/${childId}/scheduled`,
      );
      const scheduledSubjectData = res?.data;

      console.log('scheduled subjects 호출함', scheduledSubjectData);

      setSubjects(scheduledSubjectData?.subjects ?? []);
    } catch (err) {
      console.error('Scheduled subjects fetch error:', err);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  }, [childId]);

  return { subjects, loading, refetch: fetchScheduledSubjects, setSubjects };
}
