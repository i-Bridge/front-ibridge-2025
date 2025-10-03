'use client';

import { useState } from 'react';
import { useSetupStore } from '@/store/useSetupStore';

const Step0_agreement = () => {
  const { setStep } = useSetupStore();
  const [isAgreed, setIsAgreed] = useState<boolean | null>(null);

  const handleNext = () => {
    if (isAgreed) {
      setStep(1); // Step1로 이동
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 text-base px-4 py-6">
      {/* 환영 메시지 */}
      <div className="text-center mb-2">
  <h2 className="text-2xl font-bold mb-4">환영합니다 🎉</h2>
  <p className="text-gray-600 whitespace-pre-line text-sm">
    우리 아이의 성장 이야기를 함께 기록하고 돌아볼 수 있는 여정에 오신 걸 진심으로 환영해요.
    <br />
    <br />
    서비스 이용을 위해 최소한의 개인정보를 수집·이용하며, 모든 정보는 관련 법령에 따라 안전하게 관리됩니다.
    <br />
    등록하신 자녀 정보는 부모님 계정에만 개인적으로 저장되며, 외부에 공유되지 않습니다.
    <br />
    
  </p>
</div>

      {/* 개인정보 동의서 */}
      <div className="border p-4 rounded-lg bg-white text-sm h-48 overflow-y-auto scrollbar-custom">
        <h3 className="font-semibold mb-2">개인정보 처리 방침</h3>
        <p className="mb-2">
          본 서비스는 가족 계정 생성과 자녀 관리 기능을 제공하기 위해 개인정보를 수집/활용합니다.
        </p>
        <p className="mb-2">
          입력하신 이름, 자녀 수 등의 정보는 서비스 운영을 위한 목적으로만 사용되며, 
          관련 법률에 따라 안전하게 보호됩니다.
        </p>
        <p className="mb-2">동의하지 않으실 경우, 서비스 이용이 제한될 수 있습니다.</p>
      </div>

      {/* 동의 여부 선택 */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="agreement"
            checked={isAgreed === true}
            onChange={() => setIsAgreed(true)}
          />
          동의합니다
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="agreement"
            checked={isAgreed === false}
            onChange={() => setIsAgreed(false)}
          />
          동의하지 않습니다
        </label>
      </div>

      {/* 다음 버튼 */}
      <button
        onClick={handleNext}
        disabled={!isAgreed}
        className={`mt-6 py-2 px-4 rounded-xl self-end flex items-center gap-2
          ${
            isAgreed
              ? 'bg-i-lightgreen text-white hover:bg-i-lightgreen/80'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
      >
        다음
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
          />
        </svg>
      </button>
    </div>
  );
};

export default Step0_agreement;
