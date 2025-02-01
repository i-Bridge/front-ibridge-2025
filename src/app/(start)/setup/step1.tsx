// src/app/setup/step1.tsx
'use client';
import { useSetupStore } from '@/store/setup/setupStore';

const Step1 = () => {
  const { nextStep } = useSetupStore();
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between">
        <span>자녀 수</span>
        <input type="number" min="0" max="10" className="border p-1" />
      </div>
      <div className="flex justify-between">
        <span>이름</span>
        <input type="text" className="border p-1" />
        <button className="ml-2 bg-blue-500 text-white px-2 py-1">등록</button>
      </div>
      <div className="flex justify-between">
        <span>생년월일</span>
        <input type="date" className="border p-1" />
      </div>
      <button
        onClick={nextStep}
        className="bg-blue-500 text-white px-4 py-2 mt-4 self-end"
      >
        다음
      </button>
    </div>
  );
};

export default Step1;
