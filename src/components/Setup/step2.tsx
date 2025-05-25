'use client';

import { useSetupStore } from '@/store/setup/setupStore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Fetcher } from '@/lib/fetcher';

const Step2 = () => {
  const router = useRouter();

  const {
    nextChild,
    currentChildIndex,
    childrenCount,
    familyName,
    childrenInfo,
    setStep,
    setCurrentChildIndex,
    updateChildInfo,
  } = useSetupStore();

  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const currentChild = childrenInfo[currentChildIndex] || {
    name: '',
    gender: null,
    birth: '',
  };

  const [name, setName] = useState(currentChild.name);
  const [gender, setGender] = useState<number | null>(currentChild.gender);
  const [birth, setBirthdate] = useState(currentChild.birth);

  useEffect(() => {
    setName(childrenInfo[currentChildIndex]?.name || '');
    setGender(childrenInfo[currentChildIndex]?.gender ?? null);
    setBirthdate(childrenInfo[currentChildIndex]?.birth || '');
    setError(null);
  }, [currentChildIndex, childrenInfo]);

  const handleNext = async () => {
    if (!name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }

    if (gender === null) {
      setError('성별을 선택해주세요.');
      return;
    }

    if (!birth) {
      setError('생년월일을 입력해주세요.');
      return;
    }

    setError(null);

    // 현재 자식 정보 스토어에 저장
    updateChildInfo(currentChildIndex, { name, gender, birth });

    const finalChildrenList = [...childrenInfo];
    finalChildrenList[currentChildIndex] = { name, gender, birth };

    if (currentChildIndex + 1 >= childrenCount) {
      // 마지막 자식까지 입력한 경우 서버로 전송
      try {
        const res = await Fetcher('/start/signup/new', {
          method: 'POST',
          data: {
            familyName,
            children: finalChildrenList,
          },
        });
        console.log('서버 전송:', res);
        setIsSuccess(true);
      } catch (error) {
        console.error('자녀 정보 저장 실패:', error);
        setError('자녀 정보 저장 중 문제가 발생했습니다.');
        setIsSuccess(false); // 실패한 경우
      }
    } else {
      // 다음 자식 입력으로 이동
      nextChild();
    }
  };

  const handlePrevious = () => {
    updateChildInfo(currentChildIndex, { name, gender: gender ?? 0, birth });
    if (currentChildIndex === 0) {
      setStep(1);
    } else {
      setCurrentChildIndex(currentChildIndex - 1);
    }
  };

  // 성공적으로 데이터를 저장했을 경우 1초 뒤에 profile 페이지로 이동
  useEffect(() => {
    if (isSuccess) {
      alert('dklfs');
      setTimeout(() => {
        router.push('/profile');
      }, 10000); // 1초 뒤에 페이지 이동
    }
  }, [isSuccess, router]);

  return (
    <div className="w-full flex flex-col gap-3 px-4 py-2 ">
      <div className="h-[20px] mb-1 ">
        {error && <p className="text-red-500 whitespace-nowrap text-sm">{error}</p>}
      </div>

      <div className="flex justify-between items-center">
        <span>이름</span>
        <input
          type="text"
          className="border p-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex justify-between items-center">
        <span>성별</span>
        <div className="flex gap-4">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="gender"
              value="0"
              checked={gender === 0}
              onChange={() => setGender(0)}
            />
            남자
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="gender"
              value="1"
              checked={gender === 1}
              onChange={() => setGender(1)}
            />
            여자
          </label>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <span>생년월일</span>
        <input
          type="date"
          className="border p-1"
          value={birth}
          onChange={(e) => setBirthdate(e.target.value)}
        />
      </div>

      <div className="flex justify-between gap-4 mt-4">
        <button
          onClick={handlePrevious}
          className="text-gray-900  px-2 py-2"
        >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
</svg>

        </button>

        <button
          onClick={handleNext}
          className={` py-2 flex items-center justify-center transition
    ${
      currentChildIndex + 1 === childrenCount
        ? 'bg-orange-400 hover:bg-orange-300 text-white rounded-xl px-4'
        : 'text-gray-900 hover:text-gray-400 px-2'
    }
  `}
        >
          {currentChildIndex + 1 === childrenCount ? (
            '완료'
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default Step2;
