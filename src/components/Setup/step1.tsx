'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { ApiResponse } from '@/types';
import { useSetupStore } from '@/store/setup/setupStore';

interface DupFamilyNameData {
  exist: false;
}

export default function Step1() {
  const [dupFamilyNameData, setDupFamilyNameData] = useState<DupFamilyNameData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [familyName, setFamilyName] = useState<string>(''); // familyName 상태 추가
  const [isNameChecked, setIsNameChecked] = useState<boolean>(false); // 이름 중복 확인 여부 상태 추가

  const { setChildrenCount, setStep} = useSetupStore();



  // familyName 중복 확인 함수
  const handleCheckName = async () => {
    if (!familyName) {
      setError('가족 이름을 입력해 주세요.');
      return;
    }

    try {
      // 중복 확인 API 요청
      const res = await axiosInstance.post<ApiResponse<DupFamilyNameData,{ isSuccess: boolean }>>('/start/signup/dup', {
        familyName,
      });

      console.log('중복 확인 API 응답:', res);
      setDupFamilyNameData(res.data.data ?? null);

      if (res.data.code !== '200' || !res.data.isSuccess) {
        setError('중복 확인 실패');
        return;
      }

    } catch (err) {
      console.error('중복 확인 중 오류 발생:', err);
      setError('중복 확인 중 오류가 발생했습니다.');
    }
    
    if(!dupFamilyNameData?.exist){
      console.log("사용가능");
      setIsNameChecked(true);
    }else{
      console.log("사용불가");
      setIsNameChecked(false);
    }
  };

  const handleNext = () => {
    if (!isNameChecked) {
      setError('가족 이름을 먼저 확인해주세요.');
      return;
    }

    const inputElement = document.getElementById('childrenCount') as HTMLInputElement;
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
}