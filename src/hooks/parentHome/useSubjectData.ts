'use client';
import { useEffect, useState } from 'react';
import { useSubjectStore } from '@/store/useSubjectStore';
import { Fetcher } from '@/lib/fetcher';
import { useParams } from 'next/navigation';
import { Question } from '@/types/index';

interface Subject {
  subjectId: number;
  subjectTitle: string;
}

interface SubjectsData {
  subjects: Subject;
  questions: Question[];
}

// 캐시: childId_subjectId 조합을 key로 사용
const cache = new Map<string, { subject: Subject; questions: Question[] }>();
const MAX_CACHE_SIZE = 5;

export const useSubjectData = () => {
  const { selectedSubjectId } = useSubjectStore();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const childId = params?.childId;

  useEffect(() => {
    if (!selectedSubjectId || !childId) return;

    const cacheKey = `${childId}_${selectedSubjectId}`;

    // 캐시에 있는지 확인
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('subject 캐시에 이미 있음',cached.subject.subjectId);
      setSubject(cached.subject);
      setQuestions([...cached.questions]);
      return;
    }

    const fetchSubjectData = async () => {
      setLoading(true);
      try {
        const res = await Fetcher<SubjectsData>(
          `/parent/${childId}/${selectedSubjectId}`,
        );
        const subjectsData = res?.data;
        if (res?.isSuccess && subjectsData) {
          console.log('subject 호출함', subjectsData);
          const fetchedSubject = subjectsData.subjects;
          const fetchedQuestions = subjectsData.questions || [];

          setSubject(fetchedSubject);
          setQuestions(fetchedQuestions);

          // 캐시에 저장
          cache.set(cacheKey, {
            subject: fetchedSubject,
            questions: fetchedQuestions,
          });

          // 캐시 사이즈 관리
          if (cache.size > MAX_CACHE_SIZE) {
            const firstKey = cache.keys().next().value;
            if (firstKey !== undefined) {
              cache.delete(firstKey);
            } else {
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
  }, [childId, selectedSubjectId]);

  return {
    subject,
    questions,
    loading,
  };
};
