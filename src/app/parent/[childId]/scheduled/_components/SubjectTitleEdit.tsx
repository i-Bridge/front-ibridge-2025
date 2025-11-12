'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Fetcher } from '@/lib/api/fetcher';
import { useScheduledSubjects } from '@/hooks/parentHome/useScheduledSubjects';
import { showError } from '@/lib/toast';
import { Text } from '@/ui/Text';
import { Button } from '@/ui/Button';
import { formatDateWithDay } from '@/hooks/formatDateWithDay';
import { EditIcon, RerollIcon, GreenCheckIcon, RedXIcon } from '@/ui/icon/icon';
interface Props {
  subjectId: number;
  subjectTitle: string;
  date: string; // ✅ 날짜 prop 추가
}

const MAX_REFRESH_COUNT = 2;

const SubjectTitleEdit = ({ subjectId, subjectTitle, date }: Props) => {
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
        { method: 'PATCH', data: { title: inputValue } },
      );
      console.log('편집 저장 응답:', res);
      if (res?.isSuccess) {
        setTitle(inputValue);
        setEditing(false);
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
      return;
    }

    try {
      const res = await Fetcher<Props>(
        `/parent/${childId}/questions/reroll?subjectId=${subjectId}`,
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
        refetchScheduled();
      }
    } catch (err) {
      console.error('새로고침 실패:', err);
      showError('새로고침 중 오류 발생');
    }
  };

  return (
    <div
      // data-editable은 디버깅용으로 남겨둡니다.
      data-editable={editing}
      // ✅ 'editing' 상태에 따라 내부 gap을 조절합니다.
      className={`self-stretch px-8 pt-6 pb-8 bg-white rounded-[20px] border border-1 border-grayscale-gray20 inline-flex flex-col justify-center items-start ${
        editing ? 'gap-3' : 'gap-1'
      }`}
    >
      {/* --- 상단 (날짜 + 버튼) --- */}
      <div className="self-stretch inline-flex justify-between items-center gap-2">
        <Text variant={'body03'} className="text-grayscale-gray60">
          {formatDateWithDay(date)}
        </Text>

        {/* --- 버튼 그룹 --- */}
        <div className="flex justify-start items-center gap-2">
          {editing ? (
            <>
              {/* 취소(X) 버튼 */}
              <Button
                data-type="x"
                onClick={handleCancel}
                className="w-10 h-10 p-1 bg-error-errorLight rounded-full justify-center items-center"
                aria-label="취소"
              >
                <RedXIcon />
              </Button>
              {/* 저장(Check) 버튼 */}
              <Button
                data-type="check"
                onClick={handleSave}
                className="w-10 h-10 p-1 bg-other-mint-light rounded-full  justify-center items-center"
                aria-label="저장"
              >
                <GreenCheckIcon />
              </Button>
            </>
          ) : (
            <>
              {/* 수정(Edit) 버튼 */}
              <Button
                data-type="edit"
                onClick={handleEditClick}
                className="w-10 h-10 p-1 bg-grayscale-gray5 rounded-full  justify-center items-center "
                aria-label="수정"
              >
                <EditIcon />
              </Button>

              {/* 새로고침(Reroll) 버튼 + 툴팁 */}
              <div
                className="relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <Button
                  data-type="reset"
                  onClick={handleReroll}
                  disabled={refreshCount >= MAX_REFRESH_COUNT}
                  className="w-10 h-10 p-1 bg-grayscale-gray5 rounded-full justify-center items-center overflow-hidden transition"
                  aria-label="새로고침"
                >
                  <RerollIcon />
                </Button>

                {/* 툴팁 (기존 로직 유지) */}
                {showTooltip && (
                  <Text
                    variant={'caption04'}
                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max max-w-xs bg-grayscale-gray30 text-gray-600 text-xs px-3 py-2 rounded shadow-sm z-10"
                  >
                    새로고침하면 질문을 다시 생성할 수 있습니다.
                    <br />
                    새로고침 기회는{' '}
                    <strong>{MAX_REFRESH_COUNT - refreshCount}</strong>번
                    남았습니다.
                  </Text>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* --- 하단 (질문 텍스트 / 입력창) --- */}
      <div className="w-full self-stretch flex justify-start items-center gap-3">
        {editing ? (
          <div className="w-full self-stretch flex-1 h-14 px-5 rounded-xl border border-1 border-grayscale-gray20 flex justify-start items-center">
            <Text
              variant={'body02'}
              className="w-full self-stretch flex justify-start items-center"
            >
              <input
                className={`w-full self-stretch`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </Text>
          </div>
        ) : (
          <Text variant={'body03'} className="">
            {title}
          </Text>
        )}
      </div>
    </div>
  );
};

export default SubjectTitleEdit;
