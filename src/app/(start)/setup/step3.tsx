'use client'
import { useSetupStore } from '@/store/SetupStore';

const Step3 = () => {
    const { prevStep } = useSetupStore();
    return (
      <div className="w-full flex flex-col gap-4">
        <div className="flex justify-between"><span>프로필 사진</span><input type="file" className="border p-1" /></div>
        <div className="flex justify-between"><span>자기소개</span><textarea className="border p-1 w-full" /></div>
        <div className="flex justify-between mt-4">
          <button onClick={prevStep} className="bg-gray-500 text-white px-4 py-2">이전</button>
          <button onClick={() => window.location.href = '/parent/home'} className="bg-green-500 text-white px-4 py-2">완료</button>
        </div>
      </div>
    );
  };
  

export default Step3;