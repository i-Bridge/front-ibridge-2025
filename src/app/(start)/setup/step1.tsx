'use client';
import { useSetupStore } from '@/store/setup/setupStore';

const Step1 = () => {
  const { setChildrenCount, setStep } = useSetupStore(); // ✅ setStep 추가

  const handleNext = () => {
    const inputElement = document.getElementById('childrenCount') as HTMLInputElement;
    const count = parseInt(inputElement.value, 10) || 0;

    console.log("입력된 자녀 수:", count); // ✅ 값 확인용
    setChildrenCount(count);
    setStep(2); // ✅ step 변경 확인

    console.log("step 변경됨: 2");
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between">
        <span>이름</span>
        <input type="text" className="border p-1" />
      </div>
      <div className="flex justify-between">
        <span>생년월일</span>
        <input type="date" className="border p-1" />
      </div>
      <div className="flex justify-between">
        <span>자녀 수</span>
        <input id="childrenCount" type="number" min="0" max="10" className="border p-1" />
      </div>
      <button onClick={handleNext} className="bg-blue-500 text-white px-4 py-2 mt-4 self-end">
        다음
      </button>
    </div>
  );
};

export default Step1;
