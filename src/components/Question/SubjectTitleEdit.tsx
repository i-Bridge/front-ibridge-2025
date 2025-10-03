'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Fetcher } from '@/lib/fetcher';
import { useSubjectsInfinite } from '@/hooks/parentHome/useSubjectsInfinite';
import { useScheduledSubjects } from '@/hooks/parentHome/useScheduledSubjects';
import { showWarning, showError } from '@/lib/toast';

interface Props {
  subjectId: number;
  subjectTitle: string;
  subjectDate: string; // YYYY-MM-DD
}

const MAX_REFRESH_COUNT = 2;

const SubjectTitleEdit = ({ subjectId, subjectTitle, subjectDate }: Props) => {
  const { childId } = useParams();
  const { refetch: refetchScheduled } = useScheduledSubjects();

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(subjectTitle);
  const [inputValue, setInputValue] = useState(subjectTitle);

  const [refreshCount, setRefreshCount] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const localStorageKey = `refreshCount-${childId}-${subjectId}`;

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
        `/parent/${childId}/questions/edit?subjectId=${subjectId}`,
        { method: 'PATCH', data: { title: inputValue } }
      );
      console.log('편집 저장 응답:', res);
      if (res?.isSuccess) {
        setTitle(inputValue);
        setEditing(false);

        // 오늘 날짜면 infiniteSubjects refetch, 아니면 scheduledSubjects refetch
        
          refetchScheduled();
        
      } else {
        showError('저장 실패');
      }
    } catch (err) {
      console.error('편집 저장 실패:', err);
      showError('편집 저장 중 오류 발생');
    }
  };

  const handleReroll = async () => {
    if (refreshCount >= MAX_REFRESH_COUNT) {
      showWarning('이 주제는 더 이상 새로고침할 수 없습니다!');
      return;
    }

    try {
      const res = await Fetcher<Props>(
        `/parent/${childId}/questions/reroll?subjectId=${subjectId}`
      );

      const subjectdata = res.data;
      console.log('새로고침 응답:', res);
      if (!subjectdata) return;

      if (res?.isSuccess) {
        const newTitle = subjectdata.subjectTitle;
        setTitle(newTitle);
        setInputValue(newTitle);

        const newCount = refreshCount + 1;
        setRefreshCount(newCount);
        localStorage.setItem(localStorageKey, String(newCount));

        // 새로고침 후도 날짜 기준 refetch
        refetchScheduled();
      }
    } catch (err) {
      console.error('새로고침 실패:', err);
      showError('새로고침 중 오류 발생');
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
        <span>{title}</span>
      )}

      <div className="flex gap-2">
        {editing ? (
          <>
            <button
              onClick={handleSave}
              className="text-green-600 hover:underline"
              aria-label="저장"
            >
              저장
            </button>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:underline"
              aria-label="취소"
            >
              취소
            </button>
          </>
        ) : (
          <>
            <button onClick={handleEditClick} className="text-blue-600">
              수정
            </button>

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
                새로고침
              </button>

              {showTooltip && (
                <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 w-max max-w-xs bg-gray-100 text-gray-600 text-xs px-3 py-2 rounded shadow-sm z-10">
                  새로고침하면 질문을 다시 생성할 수 있습니다.
                  <br />
                  새로고침 기회는{' '}
                  <strong>{MAX_REFRESH_COUNT - refreshCount}</strong>번 남았습니다.
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
