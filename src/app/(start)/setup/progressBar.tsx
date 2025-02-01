'use client';
import { useSetupStore } from '@/store/setup/setupStore';

const ProgressBar = () => {
  const { step } = useSetupStore();
  return (
    <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
      <div
        className={`h-full bg-blue-500 transition-all`}
        style={{ width: `${(step / 3) * 100}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
