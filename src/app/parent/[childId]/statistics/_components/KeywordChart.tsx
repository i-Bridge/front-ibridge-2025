// app/components/Statistic/KeywordChart.tsx
'use client';

import { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// 샘플 데이터 (달/년/누적)
const sampleData = {
  month: [10, 20, 30, 40],
  year: [25, 35, 20, 20],
  total: [50, 10, 20, 20],
};

// 라벨
const labels = ['A', 'B', 'C', 'D'];



export default function KeywordChart() {
  const [graphType, setGraphType] = useState<'month' | 'year' | 'total'>('month');

  const data = {
    labels,
    datasets: [
      {
        label: `${graphType === 'month' ? '달' : graphType === 'year' ? '년' : '누적'} 데이터`,
        data: sampleData[graphType],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex flex-col gap-4 space-y-4 items-center justify-end">
      {/* 버튼 선택 */}
      <div className="flex gap-2">
        {(['month', 'year', 'total'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setGraphType(type)}
            className={`px-3 py-1 rounded text-sm border ${
              graphType === type ? 'bg-green-500 text-white' : 'bg-white'
            }`}
          >
            {type === 'month' ? '달' : type === 'year' ? '년' : '누적'}
          </button>
        ))}
      </div>

      {/* 파이 차트 */}
      <div style={{ width: '100%', height: 200 }}>
        <Pie data={data} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
}
