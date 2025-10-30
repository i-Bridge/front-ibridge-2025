import ModalCard from '@/ui/Modal/ModalCard';
import { Text } from '@/ui/Text';
import { Button } from '@/ui/Button';
import { Fetcher } from '@/lib/fetcher';
import CommonModalPopup from '@/ui/Modal/CommonModalPopup';
import { useState } from 'react';
import { useSetupStore } from '@/store/useSetupStore';
import { LeftArrow } from '@/constants/icon';

interface DupFamilyNameData {
  exist: boolean;
}

export default function CreateFamilyForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { setStep, familyName, setFamilyName } = useSetupStore();

  // 3. '생성하기' 버튼 클릭 핸들러
  const handleFamilyExist = async () => {
    if (!familyName) {
      setError('가족 이름을 입력해 주세요.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await Fetcher<DupFamilyNameData>('/start/signup/dup', {
        method: 'POST',
        data: { familyName },
      });

      if (res.data?.exist) {
        // 중복된 이름: 팝업 열기
        setIsModalOpen(true);
      } else {
        // 중복 없음: Zustand에 저장하고 다음 단계로
        setFamilyName(familyName);
        setStep(2);
      }
    } catch (err) {
      console.error('중복 확인 중 오류 발생:', err);
      setError('중복 확인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 6. 팝업 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFamilyName(''); // 입력창 비우기
  };

  return (
    <>
      <ModalCard hasBorder={false} className="gap-10">
        <button
          onClick={() => setStep(0)}
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
            value={familyName}
            onChange={(e) => {
              setFamilyName(e.target.value);
              if (error) setError(null); // 입력 시 오류 메시지 초기화
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleFamilyExist();
            }}
            className="self-stretch h-14 px-5 rounded-xl outline outline-1 outline-offset-[-1px] outline-grayscale-gray20 inline-flex justify-start items-center gap-2.5"
          />
          {error && (
            <Text as="div" variant="body03" className="text-red-500 px-2">
              {error}
            </Text>
          )}
        </div>

        <Button
          onClick={handleFamilyExist}
          disabled={loading}
          variant="primary"
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
            <Button variant="primary" onClick={handleCloseModal}>
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
