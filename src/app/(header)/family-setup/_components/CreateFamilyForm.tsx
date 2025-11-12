import ModalCard from '@/ui/Modal/ModalCard';
import { Text } from '@/ui/Text';
import { Button } from '@/ui/Button';
import { Fetcher } from '@/lib/api/fetcher';
import CommonModalPopup from '@/ui/Modal/CommonModalPopup';
import { useState } from 'react';
import { useSetupStore } from '@/store/useSetupStore';
import { LeftArrow } from '@/ui/icon/icon';
import { showError } from '@/lib/toast';
import * as Sentry from '@sentry/nextjs';
import { SignupExistDupResponse } from '@/types/index';

export default function CreateFamilyForm() {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const {
    setStep,
    familyName: storedFamilyName,
    setFamilyName,
    resetChildrenInfo,
  } = useSetupStore();

  const [inputFamilyName, setInputFamilyName] = useState(
    storedFamilyName || '',
  );

  // [신규] '뒤로가기' 버튼 핸들러
  const handleBack = () => {
    // 1. 로컬 입력창 비우기
    setInputFamilyName('');
    // 2. Zustand 스토어의 '저장된' 이름 비우기 (FindFamilyForm에 영향 X)
    setFamilyName('');
    // 3. (만약 있었다면) 자녀 정보도 초기화
    resetChildrenInfo();
    // 4. 이전 단계로 이동
    setStep(0);
  };

  // 3. '생성하기' 버튼 클릭 핸들러 (기존과 동일)
  const handleFamilyExist = async () => {
    if (!inputFamilyName) {
      showError('집 이름을 입력해 주세요.');
      return;
    }
    setLoading(true);

    if (inputFamilyName === storedFamilyName) {
      console.log('기존 이름과 동일. API 호출 건너뛰고 2단계로 이동.');
      setStep(2);
      setLoading(false);
      return;
    }

    try {
      const res = await Fetcher<SignupExistDupResponse>('/start/signup/dup', {
        method: 'POST',
        data: { familyName: inputFamilyName },
      });

      console.log('✅ 가족 이름 dup 확인:', res);
      if (res.data?.exist) {
        setIsModalOpen(true);
      } else {
        setFamilyName(inputFamilyName);
        resetChildrenInfo();
        setStep(2);
      }
    } catch (err) {
      Sentry.captureException(err);
      console.error('중복 확인 중 오류 발생:', err);
      showError('중복 확인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 6. 팝업 닫기 핸들러 (기존과 동일)
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setInputFamilyName(''); // 로컬 입력창만 비우기
  };

  return (
    <>
      <ModalCard hasBorder={false} className=" gap-10">
        {/* [수정] onClick에 handleBack 함수 연결 */}
        <button
          onClick={handleBack}
          className="w-10 h-10 relative overflow-hidden stroke-grayscale-gray40"
        >
          <LeftArrow />
        </button>

        <div className="flex flex-col gap-3">
          <Text as="div" variant="title01">
            집 생성하기
          </Text>
          <Text as="div" variant="body03" className="text-grayscale-gray60">
            생성할 집 이름을 입력해주세요.
          </Text>
        </div>

        {/* 입력창 및 오류 메시지 */}
        <div className="flex flex-col gap-2 self-stretch">
          <input
            type="text"
            placeholder="ex) 도란도란 우리집"
            value={inputFamilyName}
            onChange={(e) => {
              setInputFamilyName(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleFamilyExist();
            }}
            className="self-stretch h-14 px-5 rounded-xl outline outline-1 outline-offset-[-1px] outline-grayscale-gray20 inline-flex justify-start items-center gap-2.5"
          />
        </div>

        <Button
          onClick={handleFamilyExist}
          disabled={loading || inputFamilyName.trim().length === 0} // [개선] 비어있을 때 버튼 비활성화
          variant="primary"
          className="w-full h-16"
        >
          {loading ? '진행 중' : '생성하기'}
        </Button>
      </ModalCard>

      {/* 7. 중복 이름 팝업 (조건부 렌더링) */}
      {isModalOpen && (
        <CommonModalPopup
          title="해당 이름의 집이"
          titleLine2="이미 존재합니다."
          subtitle="중복되지 않는 집 이름을 입력해야 합니다"
          onClose={handleCloseModal} // 'x' 버튼이나 외부 클릭 시
          footerContent={
            <Button
              variant="primary"
              onClick={handleCloseModal}
              className="w-full hh-16"
            >
              확인
            </Button>
          }
        >
          <></>
        </CommonModalPopup>
      )}
    </>
  );
}
