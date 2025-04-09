'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { ApiResponse } from '@/types';
import { useSetupStore } from '@/store/setup/setupStore';

interface DupFamilyNameData {
  isExist: false;
}

export default function Step1() {
  const [dupFamilyNameData, setDupFamilyNameData] =
    useState<DupFamilyNameData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { setChildrenCount, setStep, registeredFamilyNames } = useSetupStore();

  useEffect(() => {
    async function fetchDupFamilyName() {
      try {
        const res =
          await axiosInstance.post<
            ApiResponse<DupFamilyNameData, { isSuccess: boolean }>
          >('/start/signup/dup');

        if (res.data.code !== '200') {
          console.error('API 응답 실패:', res.data.message);
          setError(`서버 오류: ${res.data.message}`);
          return;
        }

        if (!res.data.isSuccess) {
          console.log('isSuccess: false');
          setError('데이터 로드 실패');
          return;
        }

        setDupFamilyNameData(res.data.data);
      } catch (err) {
        console.error('요청 중 오류 발생:', err);
        setError('요청 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }

    fetchDupFamilyName();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!dupFamilyNameData) {
    return <div>데이터 없음</div>;
  }


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
        <span>가족 이름 설정 </span>
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="border p-1"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
          />
          <button
            onClick={handleCheckName}
            className="bg-green-500 text-white px-2 py-1 text-xs"
          >
            중복 확인
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
};
