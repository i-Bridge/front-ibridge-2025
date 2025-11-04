'use client';

import React, { useState, useTransition } from 'react';
import { Fetcher } from '@/lib/fetcher';
import { Text } from '@/ui/Text';
import { EditIcon } from '@/ui/icon/icon';
import { Button } from '@/ui/Button'; // 1. Button 컴포넌트 import
import CommonModalPopup from '@/ui/Modal/CommonModalPopup'; // 2. 모달 래퍼 import
import { showError } from '@/lib/toast';

export default function EditFamilyName({ familyName }: { familyName: string }) {
  // 3. 모달 열림/닫힘 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 4. 모달 내부 input 상태
  const [newFamilyName, setNewFamilyName] = useState(familyName);
  
  // 5. 페이지에 표시되는 현재 이름 (저장 성공 시 업데이트)
  const [displayedName, setDisplayedName] = useState(familyName);
  
  // 6. 로딩 상태
  const [isPending, startTransition] = useTransition();

  const handleFamilyNameSave = () => {
    startTransition(async () => {
      try {
        await Fetcher('/parent/mypage/edit/familyName', {
          method: 'PATCH',
          data: { familyName: newFamilyName },
        });
        // 7. 저장 성공 시: 페이지에 표시되는 이름 업데이트, 모달 닫기
        setDisplayedName(newFamilyName);
        setIsModalOpen(false);
      } catch (error) {
        console.error('가족 이름 수정 실패:', error);
        // 사용자에게 에러 알림 (예: alert 또는 토스트)
        showError('가족 이름 수정에 실패했습니다.');
      }
    });
  };

  // 8. 모달 푸터 정의 (name-change-modal과 동일한 구조)
  const modalFooterContent = (
    <div className="flex w-full gap-3">
      <Button
        variant="grayscale"
        onClick={() => setIsModalOpen(false)} // 모달 닫기
        disabled={isPending}
        textVariant="title04"
        className='h-16'
      >
        취소
      </Button>
      <Button
        variant="primary"
        onClick={handleFamilyNameSave}
        disabled={
          isPending ||
          newFamilyName === displayedName || // 이름이 변경되지 않았거나
          newFamilyName.trim() === '' // 비어있으면 비활성화
        }
        textVariant="title04"
        className='h-16'
      >
        {isPending ? '저장 중...' : '저장하기'}
      </Button>
    </div>
  );

  return (
    // 9. flex-col -> flex (가로 배치)
    <div className="flex items-center gap-3">
      
      
      {/* 11. 기존 EditIcon 버튼은 모달을 여는 트리거로 사용 */}
      <button onClick={() => {
        // 모달을 열 때, input 값을 현재 표시되는 이름으로 동기화
        setNewFamilyName(displayedName); 
        setIsModalOpen(true);

      }} className="ml-2 p-2 rounded-lg transition-colors hover:bg-grayscale-gray5">
        <EditIcon />
      </button>

      {/* 12. 모달 팝업 (isModalOpen이 true일 때 렌더링) */}
      {isModalOpen && (
        <CommonModalPopup
          title="가족 이름 변경하기"
          onClose={() => setIsModalOpen(false)}
          footerContent={modalFooterContent}
        >
          {/* 모달 바디 (name-change-modal의 input 구조 차용) */}
          <div className="w-full self-stretch p-10 flex flex-col gap-5">
            <div className="w-full flex flex-col justify-center items-start gap-3 ">
              <Text variant={'body03'} className="text-grayscale-gray60">
                가족 이름
              </Text>
              <div className='w-full '>
                <Text variant={'body04'} className=''>
                  <input
                    type="text"
                    value={newFamilyName}
                    onChange={(e) => setNewFamilyName(e.target.value)}
                    disabled={isPending}
                    className=" w-full self-stretch h-14 px-5 rounded-xl border border-grayscale-gray20 text-grayscale-gray90 "
                    placeholder="새 가족 이름을 입력하세요"
                    autoFocus // 모달이 열리면 자동으로 포커스
                  />
                </Text>
              </div>
            </div>
          </div>
        </CommonModalPopup>
      )}
    </div>
  );
}
