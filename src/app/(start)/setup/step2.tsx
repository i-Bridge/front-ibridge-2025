'use client';
import { useSetupStore } from '@/store/setup/setupStore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const Step2 = () => {
  const { nextChild, currentChildIndex, childrenCount } = useSetupStore();
  const router = useRouter();

  // ✅ 입력값 상태 추가
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');

  // ✅ 자녀 변경 시 입력값 초기화
  useEffect(() => {
    setName('');
    setBirthdate('');
  }, [currentChildIndex]);

  const handleNext = () => {
    if (currentChildIndex + 1 >= childrenCount) {
      router.push('/parent/home'); // ✅ 마지막 자녀 입력 후 이동
    } else {
      nextChild(); // ✅ 다음 자녀 입력 단계로 이동
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <h2 className="text-center">자녀 정보 입력 ({currentChildIndex + 1}/{childrenCount})</h2>
      <div className="flex justify-between">
        <span>이름</span>
        <input
          type="text"
          className="border p-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex justify-between">
        <span>생년월일</span>
        <input
          type="date"
          className="border p-1"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
        />
      </div>
      <button onClick={handleNext} className="bg-blue-500 text-white px-4 py-2 mt-4 self-end">
        {currentChildIndex + 1 === childrenCount ? '완료' : '다음'}
      </button>
    </div>
  );
};

export default Step2;
