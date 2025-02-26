'use client';
import { useState } from 'react';
import { useSetupStore } from '@/store/setup/setupStore';

const Step1 = () => {
  const { setChildrenCount, setStep, registeredFamilyNames } = useSetupStore();
  const [familyName, setFamilyName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isNameChecked, setIsNameChecked] = useState(false);

  const handleCheckName = () => {
    if (registeredFamilyNames.includes(familyName)) {
      setError('이미 등록된 가족 이름입니다. 다른 이름을 입력해주세요.');
      setIsNameChecked(false);
    } else {
      setError(null);
      setIsNameChecked(true);
    }
  };

  const handleNext = () => {
    if (!isNameChecked) {
      setError('가족 이름을 먼저 확인해주세요.');
      return;
    }

    const inputElement = document.getElementById('childrenCount') as HTMLInputElement;
    const count = parseInt(inputElement.value, 10) || 0;

    console.log("입력된 자녀 수:", count);
    setChildrenCount(count);
    setStep(2);

    console.log("step 변경됨: 2");
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
        <input id="childrenCount" type="number" min="0" max="10" className="border p-1" />
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

export default Step1;
