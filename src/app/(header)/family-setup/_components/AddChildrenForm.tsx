'use client';
import ModalCard from '@/ui/Modal/ModalCard';
import { Text } from '@/ui/Text';
import { Button } from '@/ui/Button';
import CustomCard from '@/ui/CustomCard';
import AddChildrenModal from '@/components/AddChildrenModal';
import { useSetupStore } from '@/store/useSetupStore';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Fetcher } from '@/lib/api/fetcher';
import { ChildCard } from '@/components/ChildCard';
import CarouselStepper from '@/components/CarouselStepper';
import { Child } from '@/types';
import { showSuccess, showError } from '@/lib/toast';
import * as Sentry from '@sentry/nextjs';
export default function AddChildrenForm() {
  const router = useRouter();
  const {
    familyName,
    childrenInfo,
    setStep,
    addChild,
    removeChild, // [신규]
    updateChild, // [신규]
  } = useSetupStore();

  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // [신규] 수정할 자녀의 인덱스. null이면 '추가' 모드.
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // [신규] 캐러셀 상태
  const [currentChildIndex, setCurrentChildIndex] = useState(0);

  const totalChildren = childrenInfo.length;
  const visibleChild =
    totalChildren > 0 ? childrenInfo[currentChildIndex] : null;

  // [신규] 캐러셀 스텝 변경 핸들러
  const handleStepChange = (newStep: number) => {
    // newStep은 1기반, 인덱스는 0기반
    if (newStep > 0 && newStep <= totalChildren) {
      setCurrentChildIndex(newStep - 1);
    }
  }; // 수정 모달 열기

  const handleOpenEditModal = (index: number) => {
    setEditingIndex(index);
    setIsAddFormOpen(true);
  };

  // [신규] 추가 모달 열기
  const handleOpenAddModal = () => {
    setEditingIndex(null); // '추가' 모드
    setIsAddFormOpen(true);
  };

  // [신규] 모달 닫기 (공통)
  const handleCloseModal = () => {
    setIsAddFormOpen(false);
    setEditingIndex(null);
  };

  // [수정] 자녀 삭제 핸들러 (캐러셀 인덱스 조정)
  const handleRemoveChild = (indexToRemove: number) => {
    removeChild(indexToRemove);
    // 삭제 후 캐러셀 인덱스 조정
    if (currentChildIndex > 0 && indexToRemove <= currentChildIndex) {
      // 만약 현재 인덱스(_
      setCurrentChildIndex(currentChildIndex - 1);
    }
  };

  // [신규] 모달에서 '추가/수정' 버튼 클릭 (공통)
  const handleSubmitModal = (childData: Child) => {
    if (editingIndex !== null) {
      updateChild(editingIndex, childData); // 수정
    } else {
      addChild(childData); // 추가
      // [UX] 새 자녀 추가 시, 캐러셀을 방금 추가한 자녀로 이동
      // childrenInfo.length는 새 자녀가 추가되기 *전* 길이 (즉, 새 자녀의 인덱스)
      setCurrentChildIndex(childrenInfo.length);
    }
    handleCloseModal(); // 모달 닫기
  };

  // "이전으로"
  const handleClose = () => {
    setStep(1);
  };

  // "완료하기"
  const handleComplete = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Fetcher('/start/signup/new', {
        method: 'POST',
        data: {
          familyName,
          children: childrenInfo,
        },
      });
      showSuccess('집이 만들어졌어요!');
      router.push('/profile');
    } catch (err: unknown) {
      Sentry.captureException(err);
      console.error('자녀 정보 저장 실패:', err);
      showError('자녀 정보 저장 중 문제가 발생했습니다. 다시 시도해주세요.');
      setIsLoading(false);
    }
  };

  const isCompleteDisabled = childrenInfo.length === 0 || isLoading;

  return (
    <>
      <ModalCard hasBorder={false} className="gap-10">
        <div className="flex flex-col gap-3 ">
          <Text variant="title01">자녀 추가하기</Text>
          <Text variant="body03" className="text-gray-500">
            자녀를 추가해주세요.
          </Text>
          {error && (
            <Text variant="body03" className="text-red-500">
              {error}
            </Text>
          )}
        </div>

        {/* [수정] 자녀 목록: ChildListItem 사용 */}
        <div className="self-stretch flex flex-col justify-start items-center gap-5 ">
          {visibleChild ? (
            <ChildCard
              key={visibleChild.id}
              child={visibleChild}
              onEdit={() => handleOpenEditModal(currentChildIndex)} // 수정
              onDelete={() => handleRemoveChild(currentChildIndex)} // 삭제
              showActions={true}
            />
          ) : (
            <CustomCard
              onClick={handleOpenAddModal} // [수정]
              className="h-44 self-stretch flex justify-center items-center border-2 border-dashed border-gray-300"
            >
              <Text variant="caption02" className="text-gray-500">
                + 자녀 추가하기
              </Text>
            </CustomCard>
          )}
        </div>
        <div className="w-full">
          {/* [신규] 피그마 스텝퍼/추가하기 버튼 영역 */}
          <div className=" w-full flex justify-between items-center">
            {/* [신규] CarouselStepper 연동 */}
            <div>
              <CarouselStepper
                currentStep={totalChildren > 0 ? currentChildIndex + 1 : 0} // 1-based, 0명일땐 0
                totalSteps={totalChildren}
                onStepChange={handleStepChange}
              />
            </div>
            {/* [신규] 피그마 "자녀 추가하기" 버튼 */}
            {totalChildren > 0 && (
              <div>
                <Button
                  onClick={handleOpenAddModal}
                  className=" h-10 px-4 py-2.5 bg-grayscale-gray5   text-grayscale-gray70 "
                >
                  <Text variant="caption04" className="text-grayscale-gray70">
                    자녀 추가하기
                  </Text>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* [수정] 피그마 하단 버튼 */}
        <div className="self-stretch inline-flex justify-start items-center gap-3">
          <Button
            onClick={handleClose}
            variant="grayscale"
            disabled={isLoading}
            className="h-16"
          >
            이전으로
          </Button>
          <Button
            onClick={handleComplete}
            variant="primary"
            disabled={isCompleteDisabled}
            className="h-16"
          >
            {isLoading ? '집 생성 중...' : '완료하기'}
          </Button>
        </div>
      </ModalCard>

      {/* [수정] 자녀 추가/수정 폼 모달 */}
      {isAddFormOpen && (
        <AddChildrenModal
          onClose={handleCloseModal}
          onSubmit={handleSubmitModal}
          // 수정 모드일 경우 initialData 전달
          initialData={
            editingIndex !== null ? childrenInfo[editingIndex] : undefined
          }
        />
      )}
    </>
  );
}
