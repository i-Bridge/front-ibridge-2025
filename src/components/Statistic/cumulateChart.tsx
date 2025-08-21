// app/components/Statistic/CumulateChart.tsx
'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

// 더미 데이터 (나중에 API 데이터로 교체 가능)
const labels = ['1','2','3','4','5','6','7'];
const data = {
  labels,
  datasets: [
    {
      label: '누적 데이터',
      data: [3, 4, 2, 5, 6, 4, 7],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      tension: 0.4, // 곡선 모양
      fill: true,
      pointRadius: 0, // 점 없애기
    },
  ],
};

export default function CumulateChart() {
  return (
    <div className="flex flex-col items-center justify-center border rounded p-4 text-center space-y-4 w-[400px]">
      {/* 누적 데이터 */}
      <div>
        <p className="text-sm text-gray-500">누적 데이터</p>
        <p className="text-lg font-bold">1234</p>
      </div>

      {/* 그래프 */}
      <div style={{ width: '100%', height: 200 }}>
        <Line data={data} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
}
