'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Text } from '@/ui/Text';
import { Button } from '@/ui/Button';
import CommonModalPopup from '@/ui/Modal/CommonModalPopup';
import { Fetcher } from '@/lib/api/fetcher';
import { showSuccess, showError } from '@/lib/toast';

interface NameChangeModalProps {
  currentName: string;
  email?: string;
  onClose: () => void;
}

export default function NameChangeModal({
  currentName,
  email,
  onClose,
}: NameChangeModalProps) {
  const [name, setName] = useState(currentName);
  const [isPending, startTransition] = useTransition();
const router=useRouter();
  /** 이름 저장 핸들러 */
  const handleSave = async () => {
    startTransition(async () => {
      try {
        const res = await Fetcher('/parent/mypage/edit/name', {
          method: 'PATCH',
          data: {name},
        });

        if (res.isSuccess) {
          showSuccess('이름 수정이 완료되었습니다.');
          onClose(); // 저장 후 닫기
          router.refresh();
        } else {
          throw new Error('이름 수정에 실패했습니다.');
        }
      } catch (error) {
        console.error('❌ 부모 이름 수정 실패:', error);
        showError('이름 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    });
  };

  /** 모달 하단 버튼 (footerContent prop) */
  const modalFooterContent = (
    <div className="flex w-full gap-3">
      <Button
        variant="grayscale"
        onClick={onClose}
        disabled={isPending}
        textVariant="title04"
        className="w-full h-16"
      >
        취소
      </Button>
      <Button
        variant="primary"
        onClick={handleSave}
        disabled={isPending || name === currentName || name.trim() === ''}
        textVariant="title04"
        className="w-full h-16"
      >
        {isPending ? '저장 중...' : '저장하기'}
      </Button>
    </div>
  );

  return (
    <CommonModalPopup
      title="관리자 정보 변경하기"
      onClose={onClose}
      footerContent={modalFooterContent}
    >
      <div className="w-full self-stretch p-10 flex flex-col gap-5">
        {/* 이름 입력 영역 */}
        <div className="w-full flex flex-col justify-center items-start gap-3">
          <Text variant="body03" className="text-grayscale-gray60">
            이름
          </Text>
          <div className="w-full">
            <Text variant="body04">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
                className="w-full h-14 px-5 rounded-xl border border-grayscale-gray20 text-grayscale-gray90"
                placeholder="새 이름을 입력하세요"
              />
            </Text>
          </div>
        </div>

        {/* 이메일 표시 영역 */}
        {email && (
          <div className="w-full flex flex-col justify-center items-start gap-3">
            <Text variant="body03" className="text-grayscale-gray60">
              이메일
            </Text>
            <div className="w-full">
              <Text variant="body04">
                <input
                  type="email"
                  value={email}
                  disabled
                  readOnly
                  className="w-full h-14 px-5 rounded-xl border border-grayscale-gray20 text-grayscale-gray50 bg-grayscale-gray5"
                />
              </Text>
            </div>
          </div>
        )}
      </div>
    </CommonModalPopup>
  );
}
