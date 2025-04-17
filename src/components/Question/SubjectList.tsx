'use client';

import { useEffect, useState } from 'react';
import { useSubjectStore } from '@/store/question/subjectStore';
import { useHomeData } from '@/hooks/home/useHomeData';
import SubjectDetailPanel from './SubjectDetailPanel';
import SubjectTitleWithActions from './SubjectTitleWithActions';

type Subject = {
  subjectId: number;
  subjectTitle: string;
  answer: boolean;
};

type Props = {
  initialSubjects: Subject[]; // SSR로 받은 초기 subject 리스트
};

const SubjectList = ({ initialSubjects }: Props) => {
  const { selectedSubjectId, setSelectedSubjectId } = useSubjectStore();

  // 1. 날짜가 바뀌면 데이터를 받아오기 위한 훅 호출 (처음에는 빈 리스트로 시작)
  const { subjects: fetchedSubjects, loading } = useHomeData();

  // 2. 초기 데이터와 fetchedSubjects를 조합하여 사용
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);

  // 3. fetchedSubjects가 변경되면 subjects 상태 업데이트
  useEffect(() => {
    if (fetchedSubjects) {
      setSubjects(fetchedSubjects);
    }
  }, [fetchedSubjects]);

  const handleClick = (subjectId: number) => {
    if (selectedSubjectId === subjectId) {
      setSelectedSubjectId(null); // 토글 닫기
    } else {
      setSelectedSubjectId(subjectId);
    }
  };

  return (
    <div className="space-y-2">
      {loading ? (
        <div className="text-gray-500">불러오는 중...</div>
      ) : (
        subjects.map((subject) => (
          <div
            key={subject.subjectId}
            onClick={() => handleClick(subject.subjectId)}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              selectedSubjectId === subject.subjectId
                ? 'bg-blue-100'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            <div className="font-semibold">
              {subject.answer ? (
                <div>{subject.subjectTitle}</div>
              ) : (
                <SubjectTitleWithActions
                  subjectId={subject.subjectId}
                  subjectTitle={subject.subjectTitle}
                />
              )}
            </div>
            {selectedSubjectId === subject.subjectId && (
              <div className="mt-2">
                {/* 장점: 필요할 때만 렌더링 함 */}
                <SubjectDetailPanel />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default SubjectList;
