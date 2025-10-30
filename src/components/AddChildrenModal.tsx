'use client';

import { useState } from 'react';
import { Text } from '@/ui/Text';
import { Button } from '@/ui/Button';
import CommonModal from '@/ui/Modal/CommonModalPopup';

// 부모 컴포넌트가 요구하는 자녀 정보 타입
interface ChildInfo {
  name: string;
  gender: number; // 0 (남자) 또는 1 (여자)
  birth: string; // 'YYYY-MM-DD' 형식의 문자열
}

// 부모 컴포넌트에서 받을 props
interface AddChildFormProps {
  onClose: () => void;
  onSubmit: (childData: ChildInfo) => void;
  initialData?: ChildInfo; // 💡 optional prop으로 initialData 추가
}

export default function AddChildForm({
  onClose,
  onSubmit,
  initialData,
}: AddChildFormProps) {
  // --- 상태 및 로직 (원본과 동일) ---
  const [name, setName] = useState(initialData?.name || '');
  const [birthday, setBirthday] = useState<Date | null>(
    initialData ? new Date(initialData.birth) : null,
  );
  const [selectedGender, setSelectedGender] = useState<number | null>(
    initialData?.gender ?? null,
  );

  const isFormValid =
    name.trim() !== '' && birthday !== null && selectedGender !== null;
  const isEditing = !!initialData; // 수정 모드인지 확인

  const handleSubmit = () => {
    if (!isFormValid) return;
    // birthday가 null이 아님을 isFormValid로 확인했으므로 non-null assertion (!) 사용
    const birthString = birthday!.toISOString().split('T')[0];
    onSubmit({
      name: name.trim(),
      birth: birthString,
      gender: selectedGender!,
    });
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <CommonModal
      title={isEditing ? '자녀 수정하기' : '자녀 추가하기'}
      onClose={onClose}
      footerClassName="flex-row" // 💡 버튼 가로 정렬
      footerContent={
        // 💡 푸터 영역에 버튼들 전달
        <>
          <Button variant="grayscale" onClick={handleCancel}>
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            {isEditing ? '수정하기' : '추가하기'}
          </Button>
        </>
      }
    >
      {/* 💡 CommonModal의 children으로 폼 영역 전달 (p-10 포함) */}
      <div className="self-stretch p-10 flex flex-col gap-5">
        {/* 이름 필드 */}
        <div className="flex flex-col gap-3">
          <Text variant="body02" className="text-gray-500">
            이름
          </Text>
          <div className="self-stretch h-14 px-5 rounded-xl border border-gray-300 flex items-center gap-2.5">
            <input
              type="text"
              placeholder="홍길동"
              className="flex-1 w-full bg-transparent text-gray-900 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        {/* 생일 필드 */}
        <div className="flex flex-col gap-3">
          <Text variant="body02" className="text-gray-500">
            생일
          </Text>
          <input
            type="date"
            className="self-stretch h-14 px-5 rounded-xl border border-gray-300 text-gray-900"
            value={birthday ? birthday.toISOString().split('T')[0] : ''}
            onChange={(e) =>
              setBirthday(e.target.value ? new Date(e.target.value) : null)
            }
          />
        </div>

        {/* 성별 필드 */}
        <div className="flex flex-col gap-3">
          <Text variant="body02" className="text-gray-500">
            성별
          </Text>
          <div className="self-stretch inline-flex gap-2">
            <div
              className={`flex-1 h-14 px-5 rounded-xl border flex justify-center items-center cursor-pointer ${
                selectedGender === 1
                  ? 'border-primary-primary'
                  : 'border-gray-300'
              }`}
              onClick={() => setSelectedGender(1)}
            >
              <Text
                variant="body03"
                className={
                  selectedGender === 1
                    ? 'text-primary-primary'
                    : 'text-gray-500'
                }
              >
                여자
              </Text>
            </div>
            <div
              className={`flex-1 h-14 px-5 rounded-xl border flex justify-center items-center cursor-pointer ${
                selectedGender === 0
                  ? 'border-primary-primary'
                  : 'border-gray-300'
              }`}
              onClick={() => setSelectedGender(0)}
            >
              <Text
                variant="body03"
                className={
                  selectedGender === 0
                    ? 'text-primary-primary'
                    : 'text-gray-500'
                }
              >
                남자
              </Text>
            </div>
          </div>
        </div>
      </div>
    </CommonModal>
  );
}
