'use client';

import { useState } from 'react';
import SubjectList from '@/components/Question/SubjectList';
import ScheduledList from '@/components/Question/ScheduledList';
import { Subject } from '@/types/index';

interface Props {
  initialSubjects: Subject[];
  childname: string;
}

const ContentSwitcher = ({ initialSubjects, childname }: Props) => {
  const [showScheduled, setShowScheduled] = useState(false);

  return (
    <div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => setShowScheduled(false)}
          className={`px-4 py-2 rounded-full transition-colors ${
            !showScheduled
              ? 'bg-orange-100 text-gray-900' // 선택된 버튼 주황
              : 'bg-gray-100 text-gray-600' // 선택 안된 버튼 회색
          }`}
        >
          {childname}의 Dialog
        </button>

        <button
          onClick={() => setShowScheduled(true)}
          className={`px-4 py-2 rounded-full transition-colors ${
            showScheduled
              ? 'bg-orange-100 text-gray-900' // 선택된 버튼 주황
              : 'bg-gray-100 text-gray-600' // 선택 안된 버튼 회색
          }`}
        >
          예정된 질문
        </button>
      </div>

      <div className="mt-4">
        {showScheduled ? (
          <ScheduledList />
        ) : (
          <SubjectList initialSubjects={initialSubjects} />
        )}
      </div>
    </div>
  );
};

export default ContentSwitcher;
