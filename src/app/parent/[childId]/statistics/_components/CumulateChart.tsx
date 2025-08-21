// app/components/Statistic/CumulateChart.tsx
'use client';

import { useState, useEffect } from 'react';
import { Fetcher } from '@/lib/fetcher';
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

interface CumulateAPI{
 cumList: number[];
}

interface CumulateChartProps {
  childId: string;
  defaultCumList: number[]; // 기본 "일" 기준 데이터
}

export default function CumulateChart({ childId, defaultCumList }: CumulateChartProps) {
 const [periodType, setPeriodType] = useState<'day' | 'week' | 'month'>('day'); 
  const [cumList, setCumList] = useState<number[]>(defaultCumList);

    // range 바뀔 때마다 API 호출
  useEffect(() => {
    async function fetchCumulateData() {
      try {
        const cumulateRes = await Fetcher<CumulateAPI>(
          `/parent/${childId}/stat?periodType=${periodType}` 
        );
        const cumulateData=cumulateRes.data;
        setCumList(cumulateData?.cumList ?? []);
        console.log("cumulateData",cumulateData?.cumList);
      } catch (err) {
        console.error(err);
      }
    }

    // 기본 데이터는 이미 있으니까, periodType가 day일 때는 재호출 안 함
    if (periodType !== 'day') {
      fetchCumulateData();
    }
  }, [periodType, childId]);


const labels = ['1','2','3','4','5','6','7'];
const chartdata = {
  labels,
  datasets: [
    {
      label: '누적 답변 수',
      data: cumList,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      tension: 0.4, // 곡선 모양
      fill: true,
      pointRadius: 0, // 점 없애기
    },
  ],
};

  const chartoptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };
console.log("cumList",cumList);
  return (
    <div className="flex flex-col items-center justify-center border rounded p-4 text-center space-y-4 w-[400px]">
      {/* 상단 버튼 */}
      <div className="flex space-x-2">
        {['day', 'week', 'month'].map((option) => (
          <button
            key={option}
            onClick={() => setPeriodType(option as 'day' | 'week' | 'month')}
            className={`px-3 py-1 rounded ${
              periodType === option ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {option === 'day' ? '일' : option === 'week' ? '주' : '달'}
          </button>
        ))}
      </div>
      
      {/* 그래프 */}
      <div style={{ width: '100%', height: 200 }}>
        <Line data={chartdata} options={chartoptions} />
      </div>
    </div>
  );
}
