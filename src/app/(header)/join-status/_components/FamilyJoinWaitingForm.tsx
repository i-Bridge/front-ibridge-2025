'use client';

import ModalCard from '@/ui/Modal/ModalCard';
import { Text } from '@/ui/Text';
import { Button } from '@/ui/Button';
import CustomCard from '@/ui/CustomCard';
import { useState } from 'react';
import CommonModalPopup from '@/ui/Modal/CommonModalPopup';
import { Fetcher } from '@/lib/api/fetcher';
import { useRouter } from 'next/navigation';
import { showError, showSuccess } from '@/lib/toast';
import * as Sentry from '@sentry/nextjs';
import { Parent } from '@/types';

// 1. props 인터페이스 수정: 불필요한 props(onCancelSuccess, loading) 제거
interface FamilyJoinSuccessProps {
  familyName: string;
  parents: Parent[]; // 부모 이름 목록
}

/**
 * 가족 합류 성공 (Status 2) 시 렌더링되는 폼
 * @param familyName - 합류한 가족 이름
 * @param parents - 가족 관리자 이름 목록
 */
export default function FamilyJoinSuccessForm({
  familyName,
  parents,
}: FamilyJoinSuccessProps) {
  const displayName = familyName || '요청한 가족';
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 2. 'parentNames' 배열을 "이름1님, 이름2님" 형태의 문자열로 변환
  const adminNames =
    parents && parents.length > 0
      ? parents.map((parent) => parent.name).join(', ')
      : `관리자`;

  //요청 취소하기
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  //취소
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  //확인
  const handleUndoRequest = async () => {
    setLoading(true);
    try {
      const res = await Fetcher('/start/signup/undo', {
        method: 'POST',
      });

      if (res.isSuccess) {
        // 요청 취소 성공
        showSuccess('집 참여 요청이 성공적으로 취소되었어요!');
        setIsModalOpen(false);
        router.replace('/family-setup');
      } else {
        showError('집 요청 취소 오류가 발생했어요. 다시 시도해주세요.');
      }
    } catch (err) {
      Sentry.captureException(err);
      console.error('집 요청 취소 중 오류 발생:', err);
      showError('집 요청 취소 오류가 발생했어요. 다시 시도해주세요.');
      setIsModalOpen(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <ModalCard
        hasBorder={false}
        className="flex flex-col gap-10 text-center items-center "
      >
        <div className="flex flex-col gap-7 text-center items-center">
          <div className="flex flex-col gap-3">
            <Text as="div" variant="title01">
              집 승인 요청
              <br />
              대기 중이에요.
            </Text>
            <Text as="div" variant="body03" className="text-grayscale-gray60">
              초대가 승인되면 해당 집에 참여하여 <br />
              서비스를 이용할 수 있어요.
            </Text>
          </div>
        </div>

        {/* 합류한 가족 정보 카드 */}
        <CustomCard className=" bg-grayscale-gray5  items-start">
          <div className="flex flex-col justify-start items-start gap-2">
            <Text as="div" variant="title02">
              {displayName}
            </Text>
            {/* 3. '관리자:' 부분에 'adminNames' 변수 사용 */}
            <Text as="div" variant="body03" className="text-grayscale-gray60">
              관리자: {adminNames}
            </Text>
          </div>
        </CustomCard>

        <Button onClick={handleOpenModal} variant="grayscale" className="w-full h-16">
          요청 취소하기
        </Button>
      </ModalCard>

      {isModalOpen && (
        <CommonModalPopup
          title="요청을"
          titleLine2="취소할까요?"
          onClose={handleCloseModal} // 'x' 버튼이나 외부 클릭 시
          footerContent={
            <div className="w-full flex flex-row gap-3">
              <Button
                variant="grayscale"
                onClick={handleCloseModal}
                className="w-full h-16"
              >
                취소
              </Button>
              <Button
                onClick={handleUndoRequest}
                disabled={loading}
                variant="primary"
                className="w-full h-16"
              >
                {loading ? '요청 취소 중' : '확인'}
              </Button>
            </div>
          }
        >
          <></>
        </CommonModalPopup>
      )}
    </>
  );
}
