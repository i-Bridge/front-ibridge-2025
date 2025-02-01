// src/app/setup/step2.tsx
'use client';
import { useSetupStore } from '@/store/setup/setupStore';

const Step2 = () => {
  const { nextStep, prevStep } = useSetupStore();
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between">
        <span>주소</span>
        <input type="text" className="border p-1" />
      </div>
      <div className="flex justify-between">
        <span>전화번호</span>
        <input type="text" className="border p-1" />
      </div>
      <div className="flex justify-between">
        <span>이메일</span>
        <input type="email" className="border p-1" />
      </div>
      <div className="flex justify-between mt-4">
        <button onClick={prevStep} className="bg-gray-500 text-white px-4 py-2">
          이전
        </button>
        <button onClick={nextStep} className="bg-blue-500 text-white px-4 py-2">
          다음
        </button>
      </div>
    </div>
  );
};

export default Step2;
