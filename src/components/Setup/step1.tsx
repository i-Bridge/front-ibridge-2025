'use client';
// Step1: 가족 정보 입력 및 자식 수 등록

import { useState } from 'react';
import { Fetcher } from '@/lib/fetcher';
import { useSetupStore } from '@/store/setup/setupStore';

interface DupFamilyNameData {
  exist: boolean;
}

export default function Step1() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [familyName, setFamilyName] = useState<string>('');
  const [isNameChecked, setIsNameChecked] = useState<boolean>(false);
  const {
    setChildrenCount,
    setStep,
    setFamilyName: storeSetFamilyName,
  } = useSetupStore();

  const handleCheckName = async () => {
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
        setError('이미 존재하는 가족 이름입니다.');
        setIsNameChecked(false);
      } else {
        setIsNameChecked(true);
        storeSetFamilyName(familyName);
      }
    } catch (err) {
      console.error('중복 확인 중 오류 발생:', err);
      setError('중복 확인 중 오류가 발생했습니다.');
      setIsNameChecked(false);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!isNameChecked) {
      setError('가족 이름을 먼저 확인해주세요.');
      return;
    }

    const inputElement = document.getElementById(
      'childrenCount',
    ) as HTMLInputElement;

    const count = parseInt(inputElement.value, 10) || 0;
    setChildrenCount(count);
    setStep(2); //step2: 자식 정보 설정 스텝
  };

  return (
    <div className="w-full flex flex-col gap-4 text-base px-4 py-8">
      <div className="flex justify-between items-center whitespace-nowrap ">
        <span className="min-w-[80px]">가족 이름</span>
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="border p-1 w-[160px]"
            value={familyName}
            onChange={(e) => {
              const value = e.target.value;
              setFamilyName(value);
              if (value === '') {
                setError(null);
                setIsNameChecked(false);
              }
            }}
          />
          <button
            onClick={handleCheckName}
            disabled={loading}
            className="bg-green-500 text-white px-2 py-1 text-xs disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? '확인 중...' : '중복 확인'}
          </button>
        </div>
      </div>

      <div className="h-[16px]">
        {error ? (
          <p className="text-red-500 whitespace-nowrap">{error}</p>
        ) : isNameChecked ? (
          <p className="text-green-500 whitespace-nowrap">
            등록 가능한 가족 이름입니다.
          </p>
        ) : null}
      </div>

      <div className="flex justify-between items-center whitespace-nowrap">
        <span className="min-w-[80px]">자녀 수</span>
        <input
          id="childrenCount"
          type="number"
          min="0"
          max="10"
          className="border p-1 w-[60px]"
        />
      </div>

      <button
        onClick={handleNext}
        className="bg-blue-500 text-white px-4 py-2 mt-4 self-end whitespace-nowrap"
        disabled={!isNameChecked}
      >
        다음
      </button>
    </div>
  );
}
