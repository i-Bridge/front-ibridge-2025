'use client';
// Step1: 가족 정보 입력 및 자녀 수 등록

import { useState, useEffect } from 'react';
import { Fetcher } from '@/lib/fetcher';
import { useSetupStore } from '@/store/setup/setupStore';

interface DupFamilyNameData {
  exist: boolean;
}

const Step1 = () => {
  {/* */}

  {/* 로컬 상태 관리 */}
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [familyName, setFamilyName] = useState<string>(''); 
  const [isNameChecked, setIsNameChecked] = useState<boolean>(false); 
  const [numberOfChildren, setNumberOfChildren] = useState<number>(0);
  
  {/* 스토어 저장 관리 */}
  const {
    setChildrenCount,
    setStep,
    setFamilyName: storeSetFamilyName,//스토어로 저장
    familyName: storeFamilyName, //스토어의 정보
    childrenCount: storeChildrenCount,
  } = useSetupStore();

  {/* 스토어 값 로드해서 초기화 설정 */}
  useEffect(() => {
    setFamilyName(storeFamilyName);
    setNumberOfChildren(storeChildrenCount);
  }, [storeFamilyName, storeChildrenCount]);

  {/* 중복 체크 버튼 클릭 handle */}
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
        storeSetFamilyName(familyName); // 중복 없을 때 스토어에 저장
      }
    } catch (err) {
      console.error('중복 확인 중 오류 발생:', err);
      setError('중복 확인 중 오류가 발생했습니다.');
      setIsNameChecked(false);
    } finally {
      setLoading(false);
    }
  };

  {/* Step2로 이동 */}
  const handleNext = () => {
    if (!isNameChecked) {
      setError('가족 이름을 먼저 확인해주세요.');
      return;
    }
    if (numberOfChildren <= 0) {
    setError('자녀 수는 1명 이상이어야 합니다.');
    return;
  }
    
    //자식 수 정보 저장 후 다음 단계로 
    setChildrenCount(numberOfChildren);
    setStep(2); 
  };

  return (
    <div className="w-full flex flex-col gap-3 text-base px-4 py-3">
      
       <div className="h-[20px] mb-1 ">
        {error ? (
          <p className="text-red-500 whitespace-nowrap">{error}</p>
        ) : isNameChecked ? (
          <p className="text-green-500 whitespace-nowrap">
            등록 가능한 가족 이름입니다.
          </p>
        ) : null}
      </div>
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

      

      <div className="flex justify-between items-center whitespace-nowrap mb-4">
        <span className="min-w-[80px]">자녀 수</span>
        <input
          id="childrenCount"
          type="number"
          min="0"
          max="10"
          className="border p-1 w-[60px]"
          value={numberOfChildren}
          onChange={(e) => setNumberOfChildren(Number(e.target.value))}
        />
      </div>

      <button
        onClick={handleNext}
        className="bg-blue-500 text-white px-4 py-2 mt-4 self-end whitespace-nowrap"
      >
        다음
      </button>
    </div>
  );
}

export default Step1;
