import { useEffect, useState } from 'react';
import { useDateStore } from '@/store/date/dateStore';
import { useSubjectStore } from '@/store/question/subjectStore';
import { Fetcher } from '@/lib/fetcher';
import { useParams } from 'next/navigation';

interface Question {
  questionId: number;
  text: string;
  video: string;
  image: string;
  answer: string;
}

interface Subject {
  subjectId: number;
  subjectTitle: string;
}

interface SubjectsData {
  subjects: Subject;
  questions: Question[];
}

const cache = new Map<number, { subject: Subject; questions: Question[] }>();
const MAX_CACHE_SIZE = 5;

export const useSubjectData = () => {
  const { selectedDate } = useDateStore();
  const { selectedSubjectId } = useSubjectStore();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const childId = params?.childId;

  useEffect(() => {
    if (!selectedSubjectId) return;

    // ✅ 1. 캐시 먼저 확인
    const cached = cache.get(selectedSubjectId);
    if (cached) {
      setSubject(cached.subject);
      setQuestions([...cached.questions]);
      return;
    }

    // ✅ 2. 캐시에 없으면 API 요청
    const fetchSubjectData = async () => {
      setLoading(true);
      try {
        const dateQuery = selectedDate ? `&date=${selectedDate}` : '';
        const res = await Fetcher<SubjectsData>(
          `/parent/${childId}/${selectedSubjectId}?${dateQuery}`,
        );
        const subjectsData = res?.data;
        if (res?.isSuccess && subjectsData) {
          const fetchedSubject = subjectsData.subjects;
          const fetchedQuestions = subjectsData.questions || [];

          setSubject(fetchedSubject);
          setQuestions(fetchedQuestions);

          // ✅ 3. 캐시에 저장
          cache.set(selectedSubjectId, {
            subject: fetchedSubject,
            questions: fetchedQuestions,
          });

          // ✅ 4. 캐시 사이즈 관리
          if (cache.size > MAX_CACHE_SIZE) {
            const firstKey = cache.keys().next().value;

            if (firstKey !== undefined) {
              cache.delete(firstKey);
            } else {
              // firstKey가 undefined일 경우의 처리
              console.log('첫 번째 키가 undefined입니다.');
            }
          }
        } else {
          console.error('API 호출 실패');
          setSubject(null);
          setQuestions(null);
        }
      } catch (err) {
        console.error('API 호출 오류:', err);
        setSubject(null);
        setQuestions(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectData();
  }, [selectedSubjectId, selectedDate]);

  return {
    subject,
    questions,
    loading,
  };
};
