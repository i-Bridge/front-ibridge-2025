import { useEffect, useState } from 'react';
import { useDateStore } from '@/store/date/dateStore';
import { Fetcher } from '@/lib/fetcher'; // Fetcher 경로 맞춰주세요.
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
  useEffect(() => {
    setLoading(true);

    const fetchHomeData = async () => {
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
    };

    if (selectedDate) {
      fetchHomeData();
    }

  }, [selectedDate]);

  return { subjects, loading };
}
