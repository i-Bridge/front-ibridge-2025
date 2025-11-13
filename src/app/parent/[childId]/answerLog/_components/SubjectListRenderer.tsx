'use client';

import { Subject } from '@/types/index';
import { Text } from '@/ui/Text';
import SubjectCard from '@/app/parent/[childId]/answerLog/_components/SubjectCard';
import EmptyPlaceholder from '@/ui/loading/EmptyPlaceHolder';
import LoadingPlaceholder from '@/ui/loading/LoadingAnim';
import { formatDateWithDay } from '@/hooks/formatDateWithDay';
import { useSubjectStore } from '@/store/useSubjectStore';

interface SubjectListRendererProps {
  subjects: Subject[];
  lastItemRef?: (node: HTMLDivElement | null) => void;
  isLoading: boolean; // 초기 로딩 상태
}

/**
 * Subject 리스트를 날짜별로 그룹화하여 렌더링하는 프레젠테이셔널 컴포넌트입니다.
 * 로직 없이 props를 받아 UI만 그립니다.
 */
export default function SubjectListRenderer({
  subjects,
  lastItemRef,
  isLoading,
}: SubjectListRendererProps) {
  const { selectedSubjectId, setSelectedSubjectId } = useSubjectStore();

  // 날짜별로 Subject를 그룹화
  const subjectsByDate = subjects.reduce<Record<string, Subject[]>>(
    (acc, subject) => {
      const { date } = subject;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(subject);
      return acc;
    },
    {}
  );

  const dateGroups = Object.keys(subjectsByDate);

  // 로딩 상태일 경우 로딩 UI 반환
  if (isLoading) {
    return <LoadingPlaceholder>로딩 중입니다.</LoadingPlaceholder>;
  }

  return (
    <>
      {/* 날짜별로 그룹화된 Subject들을 렌더링 */}
      {dateGroups.map((date, groupIdx) => {
        const subjectsInGroup = subjectsByDate[date];

        return (
          <div key={date} className="flex flex-col justify-start z-10">
            <div className={groupIdx > 0 ? 'mt-10' : ''}>
              <div className="mb-4">
                <Text variant="body03" className="text-grayscale-gray60">
                  {formatDateWithDay(date)}
                </Text>
              </div>

              <div className="flex flex-col gap-5">
                {subjectsInGroup.length !== 0 ? (
                  subjectsInGroup.map((subject, subjectIdx) => (
                    <SubjectCard
                      key={subject.subjectId}
                      subject={subject}
                      isSelected={selectedSubjectId === subject.subjectId}
                      onClick={() => {
                        setSelectedSubjectId(subject.subjectId);
                        console.log('Subject clicked:', subject.subjectId);
                      }}
                      ref={
                        // 마지막 항목일 경우 lastItemRef를 참조
                        groupIdx === dateGroups.length - 1 &&
                        subjectIdx === subjectsInGroup.length - 1
                          ? lastItemRef
                          : null
                      }
                    />
                  ))
                ) : (
                  <EmptyPlaceholder>
                    아직 대화 기록이 <br />
                    없어요!
                  </EmptyPlaceholder>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
