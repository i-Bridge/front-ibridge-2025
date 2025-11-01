'use client';

import ModalCard from '@/ui/Modal/ModalCard';
import { Text } from '@/ui/Text';
import { Button } from '@/ui/Button';
import CustomCard from '@/ui/CustomCard';
import { useState } from 'react';
import CommonModalPopup from '@/ui/Modal/CommonModalPopup';
import { Fetcher } from '@/lib/fetcher';
import { useRouter } from 'next/navigation';

// 1. props 인터페이스 수정: 불필요한 props(onCancelSuccess, loading) 제거
interface FamilyJoinSuccessProps {
  familyName: string;
  parentNames: string[]; // 부모 이름 목록
}

/**
 * 가족 합류 성공 (Status 2) 시 렌더링되는 폼
 * @param familyName - 합류한 가족 이름
 * @param parentNames - 가족 관리자 이름 목록
 */
export default function FamilyJoinSuccessForm({
  familyName,
  parentNames,
}: FamilyJoinSuccessProps) {
  const displayName = familyName || '요청한 가족';
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // [!!] 이 error 상태를 사용합니다.
  const router = useRouter();

  // 2. 'parentNames' 배열을 "이름1님, 이름2님" 형태의 문자열로 변환
  const adminNames =
    parentNames && parentNames.length > 0
      ? parentNames.map((name) => `${name}`).join(', ')
      : `관리자`;

  //요청 취소하기
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setError(null); // 모달 열 때 에러 초기화
  };

  //취소
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null); // [!!] 모달 닫을 때도 에러 초기화
  };

  //확인
  const handleUndoRequest = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await Fetcher('/start/signup/undo');

      if (res.isSuccess) {
        // 요청 취소 성공
        setIsModalOpen(false); // [!!] 성공 시에만 모달 닫기
        router.replace('/family-setup');
      } else {
        // 요청 취소 실패
        // [!!] 실패 시 모달을 닫지 않고 에러 메시지 설정
        setError('집 요청 취소 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('집 요청 취소 중 오류 발생:', err);
      // [!!] 실패 시 모달을 닫지 않고 에러 메시지 설정
      setError('집 요청 취소 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      // [!!] finally에서 무조건 모달을 닫는 로직 제거
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
        <CustomCard className="bg-grayscale-gray5 ">
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

        <Button onClick={handleOpenModal} variant="grayscale">
          요청 취소하기
        </Button>
      </ModalCard>

      {isModalOpen && (
        <CommonModalPopup
          title="요청을"
          titleLine2="취소할까요?"
          onClose={handleCloseModal} // 'x' 버튼이나 외부 클릭 시
          footerContent={
            <div className="flex flex-col w-full"> {/* [!!] 에러 메시지를 위해 flex-col로 변경 */}
              
              {/* [!!] 에러 메시지 표시 영역 */}
              {error && (
                <Text as="div" variant="body03" className="text-red-500 text-center mb-3">
                  {error}
                </Text>
              )}

              <div className="flex flex-row ">
                <Button variant="grayscale" onClick={handleCloseModal}>
                  취소
                </Button>
                <Button
                  onClick={handleUndoRequest}
                  disabled={loading}
                  variant="primary"
                >
                  {loading ? '요청 취소 중' : '확인'}
                </Button>
              </div>
            </div>
          }
        >
          {/* [!!] CommonModalPopup의 자식 영역은 비워둡니다 (에러는 footerContent 내부로 이동) */}
          <></>
        </CommonModalPopup>
      )}
    </>
  );
}