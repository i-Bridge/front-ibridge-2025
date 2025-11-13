'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalCard from '@/ui/Modal/ModalCard';
import { Button } from '@/ui/Button';
import { Fetcher } from '@/lib/api/fetcher';
import { useSetupStore } from '@/store/useSetupStore';
import CommonModalPopup from '@/ui/Modal/CommonModalPopup';
import { LeftArrow } from '@/ui/icon/icon';
import { showSuccess, showError } from '@/lib/toast';
import * as Sentry from '@sentry/nextjs';
import { SignupExistDupResponse } from '@/types/index';
import TitleComponent from '@/ui/Modal/TitleComponent';
import ModalFooter from '@/ui/Modal/ModalFooter';

export default function FindFamilyForm() {
  const router = useRouter();
  const { setStep, familyName, setFamilyName } = useSetupStore();

  const [inputValue, setInputValue] = useState(familyName || '');
  const [loading, setLoading] = useState(false);
  const [isNotExistModalOpen, setIsNotExistModalOpen] = useState(false);
  const [isRequestSentModalOpen, setIsRequestSentModalOpen] = useState(false);

  // [신규] '뒤로가기' 버튼 핸들러
  const handleBack = () => {
    // 1. 로컬 입력창 비우기
    setInputValue('');
    // 2. Zustand 스토어에도 "저장"된 이름이 있다면 비우기
    setFamilyName('');
    // 3. 이전 단계로 이동
    setStep(0);
  };

  // ... (handleFamilyExist 함수는 동일) ...
  const handleFamilyExist = async () => {
    if (!inputValue) {
      showError('가족 이름을 입력해 주세요.');
      return;
    }
    setLoading(true);

    try {
      const res = await Fetcher<SignupExistDupResponse>('/start/signup/dup', {
        method: 'POST',
        data: { familyName: inputValue },
      });

      if (res.data?.exist) {
        console.log('✅ 가족 이름 dup 확인--:', res.data);
        setFamilyName(inputValue); // 스토어에 저장
        setIsRequestSentModalOpen(true);
      } else {
        setIsNotExistModalOpen(true);
      }
    } catch (err) {
      Sentry.captureException(err);
      console.error('집 존재 여부 확인 중 오류 발생:', err);
      showError('집 존재 여부 확인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // ... (handleRequestSentModal 함수는 동일) ...
  const handleRequestSentModal = async () => {
    if (!familyName) {
      showError('가족 이름이 없습니다. 다시 시도해주세요.');
      return;
    }
    if (loading) return;

    setLoading(true);

    try {
      const res = await Fetcher<SignupExistDupResponse>('/start/signup/exist', {
        method: 'POST',
        data: { familyName },
      });
      console.log('✅ 가족 이름 exist 확인:', res.data);
      if (!res?.data?.exist) {
        setIsRequestSentModalOpen(false);
        setIsNotExistModalOpen(true);
        setFamilyName('');
        setInputValue('');
        return;
      } else {
        showSuccess('집 합류 요청이 성공적으로 보내졌어요!');
        setIsRequestSentModalOpen(false);
        router.replace('/join-status');
      }
    } catch (err) {
      Sentry.captureException(err);
      console.error('❌ 가족 이름 등록 실패:', err);
      showError('가족 이름 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // Modal 2 (존재하지 않음) 닫기 핸들러
  const handleCloseNotExistModal = () => {
    setIsNotExistModalOpen(false);
    // [수정] 스토어는 건드리지 않고, '입력값'만 비우는 것이 맞습니다.
    setInputValue('');
  };

  // Modal 1 (가입 요청) 닫기 핸들러 (취소 버튼)
  const handleCloseRequestSentModal = () => {
    setIsRequestSentModalOpen(false);
    // [수정] '저장된' 이름과 '입력된' 이름 모두 초기화
    setFamilyName('');
    setInputValue('');
  };

  return (
    <>
      <ModalCard hasBorder={false} className="flex flex-col gap-10">
        {/* [수정] onClick에 새로 만든 handleBack 함수 연결 */}
        <button
          onClick={handleBack}
          className="w-10 h-10 relative overflow-hidden stroke-grayscale-gray40"
        >
          <LeftArrow />
        </button>

        {/* ... (제목, 설명 텍스트) ... */}
        <div className="flex flex-col gap-3">
          <TitleComponent title='집 찾기' subtitle='참여할 집 이름을 입력해주세요.' align="start" />
        
        </div>

        {/* 입력창 (inputValue와 연결) */}
        <input
          type="text"
          placeholder="집 이름"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleFamilyExist();
          }}
          className="self-stretch h-14 px-5 rounded-xl outline outline-1 outline-offset-[-1px] outline-grayscale-gray20 inline-flex justify-start items-center gap-2.5"
        />

        {/* 참여하기 버튼 (inputValue 기준) */}
         <ModalFooter mobileAbsolute={true} className="self-stretch">
        <Button
          onClick={handleFamilyExist}
          variant="primary"
          disabled={loading || inputValue.trim().length === 0}
          className="w-full h-16"
        >
          참여하기
        </Button>
        </ModalFooter>
      </ModalCard>

      {/* ... (모달 2개 렌더링 부분은 동일) ... */}

      {/* 존재하지 않는 이름 팝업 */}
      {isNotExistModalOpen && (
        <CommonModalPopup
          title="해당 이름의 집이"
          titleLine2="존재하지 않습니다."
          subtitle="다시 한 번 확인해주세요."
          onClose={handleCloseNotExistModal}
          footerContent={
            <Button
              variant="primary"
              onClick={handleCloseNotExistModal}
              className="w-full h-16"
            >
              확인
            </Button>
          }
        >
          <div />
        </CommonModalPopup>
      )}

      {/* 가입 요청 팝업 (familyName 기준) */}
      {isRequestSentModalOpen && (
        <CommonModalPopup
          title={`🏠${familyName}🏠`}
          titleLine2="집에 참여할까요?"
          subtitle="해당 집 관리자에게 승인 요청이 전송됩니다."
          onClose={handleCloseRequestSentModal}
          footerClassName=""
          footerContent={
            <div className="w-full flex gap-3 self-stretch">
              <Button
                variant="grayscale"
                textVariant="caption02"
                onClick={handleCloseRequestSentModal}
                className="h-16"
              >
                취소
              </Button>
              <Button
                variant="primary"
                textVariant="caption02"
                className="whitespace-nowrap w-full h-16"
                onClick={handleRequestSentModal}
              >
                승인 요청 보내기
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
