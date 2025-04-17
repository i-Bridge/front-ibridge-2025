import { useEffect, useState } from "react";
import { useDateStore } from "@/store/date/dateStore";
import { useSubjectStore } from "@/store/question/subjectStore";
import { Fetcher } from '@/lib/fetcher'; 
import { useParams } from "next/navigation";

interface Question {
  questionId: number;
  text: string;
  video: string;
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

const cache = new Map<number, Question[]>(); // questions만 캐싱
const MAX_CACHE_SIZE = 5;

export const useSubjectData = () => {
  const { selectedDate } = useDateStore();
  const { selectedSubjectId } = useSubjectStore();

  const [subject, setSubject] = useState<Subject | null>(null); // subject는 캐싱하지 않고 필요 시 가져옴
  const [questions, setQuestions] = useState<Question[] | null>(null); // questions 상태 관리
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const childId = params?.childId;

  useEffect(() => {
    if (!selectedSubjectId) return;

    // 캐시에서 먼저 확인 (subjectId를 키로, questions만 캐싱)
    const cachedQuestions = cache.get(selectedSubjectId);
    if (cachedQuestions) {
      setQuestions(cachedQuestions);
      return;
    }

    const fetchSubjectData = async () => {
      setLoading(true);
      try {
        const dateQuery = selectedDate ? `&date=${selectedDate}` : "";
        const res = await Fetcher<SubjectsData>(`/parent/${childId}/${selectedSubjectId}?${dateQuery}`);

        if (res?.isSuccess) {
          const fetchedSubject = res?.data?.subjects;
          const fetchedQuestions = res?.data?.questions;

          // Subject 정보를 가져오고, questions만 상태에 저장
          setSubject(fetchedSubject ?? null);
          setQuestions(fetchedQuestions || []);

          // 캐시 처리 (questions만 캐싱)
          cache.set(selectedSubjectId, fetchedQuestions || []);
          if (cache.size > MAX_CACHE_SIZE) {
            const firstKey = cache.keys().next().value;
            if (firstKey !== undefined) {
              cache.delete(firstKey);
            }
          }
        } else {
          console.error("API 호출 실패");
          setSubject(null);
          setQuestions(null);
        }
      } catch (err) {
        console.error("API 호출 오류:", err);
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
