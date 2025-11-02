// components/name-change-modal.tsx
'use client';

import { useState, useTransition } from 'react';
import { Text } from '@/ui/Text';
import { Button } from '@/ui/Button';
import CommonModalPopup from '@/ui/Modal/CommonModalPopup'; // 1. 공용 모달 래퍼 임포트

interface NameChangeModalProps {
  currentName: string;
  email?: string; // 2. 이메일 prop 추가 (피그마 디자인 반영)
  onClose: () => void;
}

export default function NameChangeModal({
  currentName,
  email,
  onClose,
}: NameChangeModalProps) {
  const [name, setName] = useState(currentName);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      //   const result = await updateMyNameAction(name);
      //   if (result.success) {
      //     onClose(); // 성공 시 모달 닫기 (페이지는 revalidate로 자동 갱신)
      //   } else {
      //     alert(result.error || "이름 변경에 실패했습니다.");
      //   }
    });
  };



  // 4. 모달의 Footer 영역에 들어갈 컨텐츠 (footerContent prop)
  const modalFooterContent = (
    <div className="flex w-full gap-3">
      <Button
        variant="grayscale"
        onClick={onClose}
        disabled={isPending}
        textVariant="title04" // 피그마 (text-xl font-extrabold) 스펙 반영
      >
        취소
      </Button>
      <Button
        variant="primary"
        onClick={handleSave}
        disabled={isPending || name === currentName || name.trim() === ''}
        textVariant="title04" // 피그마 (text-xl font-extrabold) 스펙 반영
      >
        {isPending ? '저장 중...' : '저장하기'}
      </Button>
    </div>
  );

  return (
    <>
      <CommonModalPopup
        title="관리자 정보 변경하기"
        onClose={onClose}
        footerContent={modalFooterContent}
        // (선택) 피그마의 푸터 디자인(그림자 등)을 적용해야 한다면
        // footerClassName="shadow-[0px_-12px_20px_0px_rgba(255,255,255,1.00)]"
      >
        <div className="w-full self-stretch p-10  flex flex-col gap-5">
      {/* 1. 이름 입력 영역 */}
      <div className="w-full flex flex-col justify-center items-start gap-3 ">
        <Text variant={'body03'} className="text-grayscale-gray60">
          이름
        </Text>
        <div className='w-full '>
        <Text variant={'body04'} className=''>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isPending}
          className=" w-full self-stretch h-14 px-5 rounded-xl border border-grayscale-gray20 text-grayscale-gray90 "
          placeholder="새 이름을 입력하세요"
        />
        </Text>
        </div>
      </div>

      {/* 2. 이메일 표시 영역 (Read-only) */}
      {email && (
        <div className="w-full flex flex-col justify-center items-start gap-3 ">
          {/* '이름'과 동일하게 variant='body03' 적용 */}
          <Text variant={'body03'} className="text-grayscale-gray60">
            이메일
          </Text>
          {/* '이름'과 동일하게 div > Text > input 구조 적용 */}
          <div className="w-full ">
            <Text variant={'body04'} className="">
              <input
                type="email"
                value={email}
                disabled={true} // 수정 불가
                readOnly={true} // 수정 불가
                // '이름'의 스타일 + 기존 '이메일'의 비활성화 스타일(bg, text color) 적용
                className=" w-full self-stretch h-14 px-5 rounded-xl border border-grayscale-gray20 text-grayscale-gray50 bg-grayscale-gray5 "
              />
            </Text>
          </div>
        </div>
      )}
    </div>
      </CommonModalPopup>
    </>
  );
}
