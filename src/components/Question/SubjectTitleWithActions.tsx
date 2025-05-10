'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDateStore } from '@/store/date/dateStore';
import { Fetcher } from '@/lib/fetcher';
import { useHomeData } from '@/hooks/home/useHomeData';

interface Props {
  subjectId: number;
  subjectTitle: string;
}

const MAX_REFRESH_COUNT = 2;

const SubjectTitleWithActions = ({ subjectId, subjectTitle }: Props) => {
  const { childId } = useParams();
  const { selectedDate } = useDateStore();
  const { refetch } = useHomeData();

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(subjectTitle);
  const [inputValue, setInputValue] = useState(subjectTitle);

  const [refreshCount, setRefreshCount] = useState(0);
  const localStorageKey = `refreshCount-${childId}-${selectedDate}-${subjectId}`;

  useEffect(() => {
    const stored = localStorage.getItem(localStorageKey);
    setRefreshCount(stored ? parseInt(stored, 10) : 0);
  }, [localStorageKey]);

  const handleEditClick = () => {
    setEditing(true);
    setInputValue(title);
  };

  const handleCancel = () => {
    setEditing(false);
    setInputValue(title);
  };

  const handleSave = async () => {
    try {
      const res = await Fetcher(
        `/parent/${childId}/questions/edit?date=${selectedDate}&subjectId=${subjectId}`,
        {
          method: 'POST',
          data: { title: inputValue },
        },
      );

      if (res?.isSuccess) {
        setTitle(inputValue);
        setEditing(false);
        refetch();
      } else {
        alert('저장 실패');
      }
    } catch (err) {
      console.error('편집 저장 실패:', err);
    }
  };

  const handleReroll = async () => {
    if (refreshCount >= MAX_REFRESH_COUNT) {
      alert('이 주제는 더 이상 새로고침할 수 없습니다!');
      return;
    }

    try {
      const res = await Fetcher<Props>(
        `/parent/${childId}/questions/reroll?date=${selectedDate}&subjectId=${subjectId}`,
      );

      const subjectdata = res.data;

      if (!subjectdata) {
        return <div>로딩 중...</div>;
      }
      if (res?.isSuccess) {
        const newTitle = subjectdata.subjectTitle;
        setTitle(newTitle);
        setInputValue(newTitle);

        const newCount = refreshCount + 1;
        setRefreshCount(newCount);
        localStorage.setItem(localStorageKey, String(newCount));

        refetch();
      }
    } catch (err) {
      console.error('새로고침 실패:', err);
    }
  };

  return (
    <div className="flex justify-between items-center gap-2">
      {editing ? (
        <input
          className="border px-2 py-1 rounded w-full"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      ) : (
        <span className="font-semibold">{title}</span>
      )}

      <div className="flex gap-2">
        {editing ? (
          <>
            <button
              onClick={handleSave}
              className="text-green-600 hover:underline"
            >
              저장
            </button>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:underline"
            >
              취소
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleEditClick}
              className="text-blue-600 hover:underline"
            >
              편집
            </button>
            <button
              onClick={handleReroll}
              className={`text-orange-600 hover:underline ${
                refreshCount >= MAX_REFRESH_COUNT
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              disabled={refreshCount >= MAX_REFRESH_COUNT}
            >
              새로고침
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SubjectTitleWithActions;
