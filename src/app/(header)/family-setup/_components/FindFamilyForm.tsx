'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalCard from '@/ui/Modal/ModalCard';
import { Text } from '@/ui/Text';
import { Button } from '@/ui/Button';
import { Fetcher } from '@/lib/fetcher';
import { useSetupStore } from '@/store/useSetupStore';
import CommonModalPopup from '@/ui/Modal/CommonModalPopup';
import { LeftArrow } from '@/ui/icon/icon';
import { showSuccess, showError } from '@/lib/toast';
import * as Sentry from "@sentry/nextjs";

interface DupFamilyNameData {
  exist: boolean;
}
export default function FindFamilyForm() {
  const router = useRouter();
  const { setStep, familyName, setFamilyName } = useSetupStore();

  const [loading, setLoading] = useState(false);
  const [isNotExistModalOpen, setIsNotExistModalOpen] = useState(false);
  const [isRequestSentModalOpen, setIsRequestSentModalOpen] = useState(false);

  // 3. '참여하기' 버튼 클릭 핸들러
  const handleFamilyExist = async () => {
    if (!familyName) {
      showError('가족 이름을 입력해 주세요.');
      return;
    }
    setLoading(true);

    try {
      const res = await Fetcher<DupFamilyNameData>('/start/signup/dup', {
        method: 'POST',
        data: { familyName },
      });

      if (res.data?.exist) {
        // 집 이름 존재
        setFamilyName(familyName);
        setIsRequestSentModalOpen(true);
      } else {
        // 집 이름 없음
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

  // 2. 가족 이름 제출 및 가입 요청
  const handleRequestSentModal = async () => {
    if (!familyName) {
      showError('가족 이름을 입력해주세요!');
      return;
    }
    if (loading) return;

    setLoading(true);

    try {
      const res = await Fetcher<{ exist: boolean }>('/start/signup/exist', {
        method: 'POST',
        data: { familyName },
      });

      if (!res?.data?.exist) {
        // 존재하지 않을 시
        setIsRequestSentModalOpen(false);
        setIsNotExistModalOpen(true);
        setFamilyName('');
        return;
      } else {
        //요청 성공
        showSuccess('집 합류 요청이 성공적으로 보내졌어요!')
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
  };

  // [신규] Modal 1 (가입 요청 완료) 닫기 핸들러
  const handleCloseRequestSentModal = () => {
    setIsRequestSentModalOpen(false);
    setFamilyName(''); // 입력창 비우기
  };
  // 가족 가입 요청 API 호출

  return (
    <>
      <ModalCard hasBorder={false} className="flex flex-col gap-10">
        <button
          onClick={() => setStep(0)}
          className="w-10 h-10 relative overflow-hidden stroke-grayscale-gray40"
        >
          <LeftArrow />
        </button>
        <div className="flex flex-col gap-3">
          <Text as="div" variant="title01">
            집 찾기
          </Text>
          <Text as="div" variant="body03" className="text-grayscale-gray60">
            참여할 집 이름을 입력해주세요.
          </Text>
        </div>
        <input
          type="text"
          placeholder="집 이름"
          value={familyName}
          onChange={(e) => {
            setFamilyName(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleFamilyExist();
          }}
          className="self-stretch h-14 px-5 rounded-xl outline outline-1 outline-offset-[-1px] outline-grayscale-gray20 inline-flex justify-start items-center gap-2.5"
        />

        <Button
          onClick={handleFamilyExist}
          variant="primary"
          disabled={loading || familyName.trim().length === 0}
        >
          참여하기
        </Button>
      </ModalCard>

      {/* 존재하지 않는 이름 팝업 */}
      {isNotExistModalOpen && (
        <CommonModalPopup
          title="해당 이름의 집이"
          titleLine2="존재하지 않습니다."
          subtitle="다시 한 번 확인해주세요."
          onClose={handleCloseNotExistModal}
          footerContent={
            <Button variant="primary" onClick={handleCloseNotExistModal}>
              확인
            </Button>
          }
        >
          <div />
        </CommonModalPopup>
      )}

      {isRequestSentModalOpen && (
        <CommonModalPopup
          title={`{${familyName}}`}
          titleLine2="집에 참여할까요?"
          subtitle="해당 집 관리자에게 승인 요청이 전송됩니다."
          onClose={handleCloseRequestSentModal}
          footerClassName=''
          footerContent={
            
            <div className='w-full flex gap-3 self-stretch'>
              <Button variant="grayscale" textVariant="caption02" onClick={handleCloseRequestSentModal}>
                취소
              </Button>
              <Button variant="primary" textVariant="caption02" className='whitespace-nowrap' onClick={handleRequestSentModal}>
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
