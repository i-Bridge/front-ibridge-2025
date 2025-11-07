// /app/parent/[childId]/answerLog/_components/SubjectListRenderer.tsx
// (SubjectList.tsx와 같은 경로에 생성한다고 가정합니다)

'use client';

import { Subject } from '@/types/index';
import DateFormatter from '@/hooks/dateFormatter';
import { Text } from '@/ui/Text';
import SubjectCard from '@/app/parent/[childId]/answerLog/_components/SubjectCard';
import EmptyPlaceholder from '@/ui/loading/EmptyPlaceHolder';
import LoadingPlaceholder from '@/ui/loading/LoadingAnim';

interface SubjectListRendererProps {
  subjects: Subject[];
  selectedSubjectId: number | null;
  onSubjectClick: (id: number) => void;
  lastItemRef: (node: HTMLDivElement | null) => void;
  isLoading: boolean; // 초기 로딩 상태
  isEmpty: boolean; // 데이터가 없는 상태
  animating: boolean; // 애니메이션 상태
}

/**
 * Subject 리스트를 날짜별로 그룹화하여 렌더링하는 프레젠테이셔널 컴포넌트입니다.
 * 로직 없이 props를 받아 UI만 그립니다.
 */
export default function SubjectListRenderer({
  subjects,
  selectedSubjectId,
  onSubjectClick,
  lastItemRef,
  isLoading,
  isEmpty,
  animating,
}: SubjectListRendererProps) {
  
  // [이동] 날짜별 그룹화 로직 (데이터를 어떻게 보여줄지 결정하는 렌더링 로직)
  const subjectsByDate = subjects.reduce<Record<string, Subject[]>>(
    (acc, subject) => {
      const { date } = subject;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(subject);
      return acc;
    },
    {},
  );

  const dateGroups = Object.keys(subjectsByDate);

  // [수정] 로딩 및 빈 상태 처리를 props 기반으로 변경
  if (isLoading) {
    return <LoadingPlaceholder>로딩 중입니다. </LoadingPlaceholder>;
  }

  if (isEmpty) {
    return (
      <EmptyPlaceholder>
        아직 대화 기록이 <br />
        없어요!
      </EmptyPlaceholder>
    );
  }

  return (
    <>
      {/* 렌더링 로직은 기존과 거의 동일 */}
      {dateGroups.map((date, groupIdx) => {
        const subjectsInGroup = subjectsByDate[date];

        return (
          <div
            key={date}
            className={`flex flex-col justify-start z-10 
              ${animating ? 'animate-slide-in-right' : 'animate-slide-in-left'}
              transition-transform ease-in-out`}
          >
            <div
              key={date}
              className={groupIdx > 0 ? 'mt-10' : ''}
            >
              <div className="mb-4">
                <Text
                  variant={'body03'}
                  className="text-grayscale-gray60 "
                >
                  {DateFormatter(date)}
                </Text>
              </div>

              <div className="flex flex-col gap-5">
                {subjectsInGroup.map((subject, subjectIdx) => (
                  <SubjectCard
                    key={subject.subjectId}
                    subject={subject}
                    isSelected={selectedSubjectId === subject.subjectId}
                    // [수정] prop으로 받은 핸들러 사용
                    onClick={() => onSubjectClick(subject.subjectId)} 
                    ref={
                      // [수정] prop으로 받은 ref 사용
                      groupIdx === dateGroups.length - 1 &&
                      subjectIdx === subjectsInGroup.length - 1
                        ? lastItemRef
                        : null
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}