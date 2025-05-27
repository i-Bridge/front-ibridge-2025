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

const SubjectTitleEdit = ({ subjectId, subjectTitle }: Props) => {
  const { childId } = useParams();
  const { selectedDate } = useDateStore();
  const { refetch } = useHomeData();

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(subjectTitle);
  const [inputValue, setInputValue] = useState(subjectTitle);

  const [refreshCount, setRefreshCount] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
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
        `/parent/${childId}/questions/edit?date=${selectedDate}`,
        {
          method: 'PATCH',
          data: { title: inputValue },
        },
      );

      console.log('!!!!!!!!!!!!편집 api:' + res);
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
        `/parent/${childId}/questions/reroll?date=${selectedDate}`,
      );

      const subjectdata = res.data;

      if (!subjectdata) {
        return <div>subjectdata 로딩 중...</div>;
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
        <span className="">{title}</span>
      )}

      <div className="flex gap-2">
        {editing ? (
          <>
            <button
              onClick={handleSave}
              className="text-green-600 hover:underline"
              aria-label="저장"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>

            <button
              onClick={handleCancel}
              className="text-gray-500 hover:underline"
              aria-label="취소"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>
          </>
        ) : (
          <>
            {/* 수정 아이콘 */}
            <button onClick={handleEditClick} className="text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 
                  19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 
                  0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
            </button>
            {/* 새로고침 아이콘 + 툴팁 */}
            <div
              className="relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <button
                onClick={handleReroll}
                disabled={refreshCount >= MAX_REFRESH_COUNT}
                className={`text-orange-600 transition ${
                  refreshCount >= MAX_REFRESH_COUNT
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:text-orange-700'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 
                       3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 
                       8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              </button>

              {showTooltip && (
                <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 w-max max-w-xs bg-gray-100 text-gray-600 text-xs px-3 py-2 rounded shadow-sm z-10">
                  새로고침하면 질문을 다시 생성할 수 있습니다.
                  <br />
                  새로고침 기회는{' '}
                  <strong>{MAX_REFRESH_COUNT - refreshCount}</strong>번
                  남았습니다.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubjectTitleEdit;
