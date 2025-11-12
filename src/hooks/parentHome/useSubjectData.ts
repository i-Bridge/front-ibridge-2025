/*
 * 파일 경로: src/hooks/parentHome/useSubjectData.ts
 */
'use client';
import { useEffect, useState } from 'react';
import { useSubjectStore } from '@/store/useSubjectStore';
import { Fetcher } from '@/lib/api/fetcher';
import { useParams } from 'next/navigation';
import { Question, Subject } from '@/types/index';
// [NEW] 분리된 캐시 서비스와 타입을 임포트합니다.
import { subjectCache } from '@/lib/cache/SubjectCache';

// API 응답 데이터 타입
interface ApiSubjectsData {
  subjects: Subject;
  questions: Question[];
}

export const useSubjectData = () => {
  const { selectedSubjectId } = useSubjectStore();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [loading, setLoading] = useState(false);
  const params = useParams();

  // [MODIFIED] useParams의 childId가 string | string[] | undefined일 수 있으므로 string으로 처리
  const childIdParam = params?.childId;
  const childId = Array.isArray(childIdParam) ? childIdParam[0] : childIdParam;

  useEffect(() => {
    // [MODIFIED] childId가 string 타입인지도 확인
    if (!selectedSubjectId || !childId) {
      // 의존성이 없을 경우 상태를 초기화합니다.
      setSubject(null);
      setQuestions(null);
      setLoading(false);
      return;
    }

    // [NEW] 캐시 서비스의 유틸리티 함수로 키 생성
    const cacheKey = subjectCache.createKey(childId, selectedSubjectId);

    // 1. 캐시 확인 (캐시 모듈 사용)
    const cached = subjectCache.get(cacheKey);
    if (cached) {
      console.log('subject 캐시에 이미 있음', cached.subject.subjectId);
      setSubject(cached.subject);
      setQuestions([...cached.questions]); // 배열 복사
      setLoading(false); // 로딩 상태 확실히 false로
      return;
    }

    // 2. 캐시가 없으면 데이터 페칭
    const fetchSubjectData = async () => {
      setLoading(true);
      // 로딩 시작 시 이전 데이터를 비워줍니다.
      setSubject(null);
      setQuestions(null);

      try {
        const res = await Fetcher<ApiSubjectsData>(
          `/parent/${childId}/${selectedSubjectId}`,
        );
        const subjectsData = res?.data;

        if (res?.isSuccess && subjectsData) {
          console.log('subject 호출함', subjectsData);
          const fetchedSubject = subjectsData.subjects;
          const fetchedQuestions = subjectsData.questions || [];

          setSubject(fetchedSubject);
          setQuestions(fetchedQuestions);

          // 3. 페칭 성공 시 캐시에 저장 (캐시 모듈 사용)
          subjectCache.set(cacheKey, {
            subject: fetchedSubject,
            questions: fetchedQuestions,
          });
        } else {
          console.error('API 호출 실패', res?.message);
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
  }, [childId, selectedSubjectId]); // [MODIFIED] 의존성 배열 정리

  return {
    subject,
    questions,
    loading,
  };
};
