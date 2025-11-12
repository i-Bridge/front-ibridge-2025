'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Fetcher } from '@/lib/api/fetcher';
import { showSuccess, showError } from '@/lib/toast';
import { Text } from '@/ui/Text';
import { Button } from '@/ui/Button';
import PrivacyDetailModal from '@/app/(header)/privacy-consent/_components/PrivacyDetailModal'; // 경로 확인 필요
import PopupOverlay from '@/ui/Modal/PopupOverlay';
import ModalCard from '@/ui/Modal/ModalCard';

// 서버에서 받은 약관 상세 내용 타입
interface ConsentContent {
  consentToCollection: string;
  consentToService: string;
  consentToMarketing: string;
}

// 개별 약관 항목 타입
interface AgreementItem {
  id: 'all' | 'privacy_required' | 'service_required' | 'marketing_optional';
  label: string;
  isRequired: boolean;
  isAgreed: boolean;
  linkUrl: keyof ConsentContent | null;
}

// 초기 약관 상태 (내용은 서버에서 받은 props로 대체됨)
const INITIAL_AGREEMENTS: AgreementItem[] = [
  {
    id: 'all',
    label: '전체 동의',
    isRequired: false,
    isAgreed: false,
    linkUrl: null,
  },
  {
    id: 'privacy_required',
    label: '개인정보 수집 및 이용 동의 (필수)',
    isRequired: true,
    isAgreed: false,
    linkUrl: 'consentToCollection',
  },
  {
    id: 'service_required',
    label: '서비스 이용 약관 동의 (필수)',
    isRequired: true,
    isAgreed: false,
    linkUrl: 'consentToService',
  },
  {
    id: 'marketing_optional',
    label: '마케팅 정보 수신 동의 (선택)',
    isRequired: false,
    isAgreed: false,
    linkUrl: 'consentToMarketing',
  },
];

interface PrivacyConsentFormProps {
  content: ConsentContent;
}

export default function PrivacyConsentForm({
  content,
}: PrivacyConsentFormProps) {
  const router = useRouter();
  const [agreements, setAgreements] =
    useState<AgreementItem[]>(INITIAL_AGREEMENTS);
  const [activeModalId, setActiveModalId] = useState<
    keyof ConsentContent | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 필수 항목 전체 동의 여부 확인
  const isRequiredAllAgreed = useMemo(() => {
    return agreements
      .filter((item) => item.isRequired)
      .every((item) => item.isAgreed);
  }, [agreements]);

  // 동의 완료 버튼 활성화 여부
  const isSubmitEnabled = isRequiredAllAgreed && !isSubmitting;

  // 체크박스 핸들러
  const handleCheck = useCallback((id: string, checked: boolean) => {
    if (id === 'all') {
      // 전체 동의 로직
      setAgreements((prev) =>
        prev.map((item) => ({ ...item, isAgreed: checked })),
      );
    } else {
      // 개별 동의 로직
      setAgreements((prev) => {
        const newAgreements = prev.map((item) =>
          item.id === id ? { ...item, isAgreed: checked } : item,
        );

        // 전체 동의 항목의 상태 업데이트
        const allChecked = newAgreements
          .slice(1) // '전체 동의' 제외
          .every((item) => item.isAgreed);

        return newAgreements.map((item) =>
          item.id === 'all' ? { ...item, isAgreed: allChecked } : item,
        );
      });
    }
  }, []);

  const handleSubmit = async () => {
    if (!isSubmitEnabled) return;

    setIsSubmitting(true);

    // POST API 호출을 위한 데이터 구성
    const requiredAgreed =
      agreements.find((a) => a.id === 'privacy_required')?.isAgreed &&
      agreements.find((a) => a.id === 'service_required')?.isAgreed;
    const optionalAgreed = agreements.find(
      (a) => a.id === 'marketing_optional',
    )?.isAgreed;

    try {
      // API 호출: 동의한 내용 서버에 전송
      const postData = {
        requiredPII: requiredAgreed || false, // 필수 약관 동의 여부
        optionalPII: optionalAgreed || false, // 선택 약관 동의 여부
      };

      const res = await Fetcher('/start/signup/isConsent', {
        method: 'POST',
        data: postData,
      });

      if (res.isSuccess) {
        showSuccess('약관 동의가 완료되었습니다.');
        // 목표 로직: 다음 층(/family-setup)으로 리디렉션
        router.replace('/family-setup');
      } else {
        throw new Error('약관 동의 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ 약관 동의 제출 실패:', error);
      showError('약관 동의 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsSubmitting(false); // 실패 시 버튼 재활성화
    }
  };

  // 모달 열기 핸들러
  const handleOpenModal = useCallback((id: keyof ConsentContent) => {
    setActiveModalId(id);
  }, []);

  // 모달 닫기 핸들러
  const handleCloseModal = useCallback(() => {
    setActiveModalId(null);
  }, []);

  // Arrow Icon (Tailwind CSS 기반)
  const ArrowIcon = () => (
    <svg
      width="8"
      height="14"
      viewBox="0 0 8 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 13L7 7L1 1"
        stroke="#8B95A1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Custom Checkbox Component
  const CustomCheckbox = ({
    id,
    label,
    isAgreed,
    linkUrl,
    isDetail = false,
  }: AgreementItem & { isDetail?: boolean }) => (
    <div className="self-stretch inline-flex justify-between items-center">
      <div
        className="flex justify-start items-center gap-2 cursor-pointer"
        onClick={() => handleCheck(id, !isAgreed)}
      >
        {/* 체크박스 UI */}
        <div
          className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-100 ${
            isAgreed
              ? 'bg-primary-primary'
              : 'bg-grayscale-gray10 border border-grayscale-gray20'
          }`}
        >
          {isAgreed && (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>

        {/* 텍스트 */}
        <Text variant="body03">{label}</Text>
      </div>

      {/* 상세 보기 버튼 */}
      {isDetail && linkUrl && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // 체크박스 클릭 방지
            handleOpenModal(linkUrl);
          }}
          className="w-6 h-6 "
        >
          <ArrowIcon />
        </button>
      )}
    </div>
  );

  const modalContent = activeModalId ? content[activeModalId] : '';
  const activeAgreement = agreements.find((a) => a.linkUrl === activeModalId);

  return (
    <ModalCard hasBorder={false}>
      <div className="self-stretch flex flex-col justify-start items-center gap-10 ">
        {/* 1. 제목 및 설명 */}
        <div className="self-stretch flex flex-col justify-start items-start gap-3">
          <Text variant="title01" className="text-grayscale-gray90">
            약관에 동의해 주세요.
          </Text>
          <Text variant="body03" className="text-grayscale-gray60">
            서비스 이용을 위해 약관에 동의해 주세요.
          </Text>
        </div>

        {/* 2. 동의 항목 리스트 */}
        <div className="self-stretch flex flex-col justify-start items-start gap-5">
          {/* 전체 동의 (첫 번째 항목) */}
          <CustomCheckbox {...agreements[0]} />
          <div className="self-stretch h-px bg-grayscale-gray20" />{' '}
          {/* 구분선 */}
          {/* 개별 동의 항목들 */}
          {agreements.slice(1).map((item) => (
            <CustomCheckbox key={item.id} {...item} isDetail={true} />
          ))}
        </div>

        {/* 3. 동의 완료 버튼 */}
        <div className="self-stretch inline-flex justify-start items-center gap-3">
          <Button
            variant={'primary'}
            onClick={handleSubmit}
            disabled={!isSubmitEnabled}
            className="h-16"
          >
            {isSubmitting ? '처리 중' : '동의 완료'}
          </Button>
        </div>
      </div>

      {/* 상세 약관 모달 */}
      {activeModalId && activeAgreement && modalContent && (
        <PopupOverlay onClose={handleCloseModal}>
          <PrivacyDetailModal
            title={activeAgreement.label.split(' (')[0]}
            content={modalContent}
            onClose={handleCloseModal}
          />
        </PopupOverlay>
      )}
    </ModalCard>
  );
}
