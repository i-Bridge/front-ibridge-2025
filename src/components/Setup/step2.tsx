'use client';
import { useSetupStore } from '@/store/setup/setupStore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Fetcher } from '@/lib/fetcher';

const Step2 = () => {
  const [childrenInfo, setChildrenInfo] = useState<
    { name: string; gender: number; birth: string }[]
  >([]);

  const { nextChild, currentChildIndex, childrenCount } = useSetupStore();
  const router = useRouter();

  const [name, setName] = useState('');
  const [birth, setBirthdate] = useState('');
  const [gender, setGender] = useState<number | null>(null);

  useEffect(() => {
    setName('');
    setBirthdate('');
    setGender(null);
  }, [currentChildIndex]);

  const handleNext = async () => {
    if (gender === null) {
      alert('성별을 선택해주세요.');
      return;
    }

    // 현재 자녀 정보 저장
    const updatedChildren = [...childrenInfo, { name, gender, birth }];
    setChildrenInfo(updatedChildren);

    if (currentChildIndex + 1 >= childrenCount) {
      // 마지막 자녀면 → API 호출
      try {
        const res = await Fetcher('/start/signup/new', {
          method: 'POST',
          data: { children: updatedChildren },
        });
        console.log('서버 전송:', res);
        router.push('/profile');
      } catch (error) {
        console.error('자녀 정보 저장 실패:', error);
      }
    } else {
      nextChild();
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <h2 className="text-center">
        자녀 정보 입력 ({currentChildIndex + 1}/{childrenCount})
      </h2>

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

      <div className="flex justify-between items-center">
        <span>생년월일</span>
        <input
          type="date"
          className="border p-1"
          value={birth}
          onChange={(e) => setBirthdate(e.target.value)}
        />
      </div>

      <button
        onClick={handleNext}
        className="bg-blue-500 text-white px-4 py-2 mt-4 self-end"
      >
        {currentChildIndex + 1 === childrenCount ? '완료' : '다음'}
      </button>
    </div>
  );
};

export default Step2;
