'use client';

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

      console.log('중복 확인 API 응답:', res); // res = { exist: true }

      if (res.exist) {
        setError('이미 존재하는 가족 이름입니다.');
        console.log('❌ 가족 불가');
        setIsNameChecked(false);
      } else {
        console.log('✅ 가족 가능');
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

    console.log('입력된 자녀 수:', count);
    setChildrenCount(count);
    setStep(2);

    console.log('step 변경됨: 2');
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span>가족 이름 설정</span>
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="border p-1"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
          />
          <button
            onClick={handleCheckName}
            disabled={loading}
            className="bg-green-500 text-white px-2 py-1 text-xs disabled:opacity-50"
          >
            {loading ? '확인 중...' : '중복 확인'}
          </button>
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex justify-between">
        <span>자녀 수</span>
        <input
          id="childrenCount"
          type="number"
          min="0"
          max="10"
          className="border p-1"
        />
      </div>

      <button
        onClick={handleNext}
        className="bg-blue-500 text-white px-4 py-2 mt-4 self-end"
        disabled={!isNameChecked}
      >
        다음
      </button>
    </div>
  );
}
