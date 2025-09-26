'use client';

import { useState, useEffect } from 'react';
import { Fetcher } from '@/lib/fetcher';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ChartOptions,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

interface CumulateAPI {
  cumList: number[];
}

interface CumulateChartProps {
  childId: string;
  defaultCumList: number[];
}

export default function CumulateChart({ childId, defaultCumList }: CumulateChartProps) {
  const [periodType, setPeriodType] = useState<'day' | 'week' | 'month'>('day');
  const [cumList, setCumList] = useState<number[]>(defaultCumList);

  useEffect(() => {
    async function fetchCumulateData() {
      try {
        const cumulateRes = await Fetcher<CumulateAPI>(
          `/parent/${childId}/stat/cumulative?periodType=${periodType}`
        );
        setCumList(cumulateRes.data?.cumList ?? []);
      } catch (err) {
        console.error(err);
      }
    }

    fetchCumulateData();
  }, [periodType, childId]);

  // X축 레이블 생성
  const generateLabels = () => {
    const length = cumList.length || 7;
    const labels: string[] = [];
    for (let i = length - 1; i >= 0; i--) {
      if (periodType === 'day') labels.push(`${i}일 전`);
      else if (periodType === 'week') labels.push(`${i}주 전`);
      else if (periodType === 'month') labels.push(`${i}달 전`);
    }
    // 마지막 요소를 오늘 / 이번 주 / 이번 달로 변경
    if (labels.length > 0) {
      labels[labels.length - 1] = periodType === 'day' ? '오늘' : periodType === 'week' ? '이번 주' : '이번 달';
    }
    return labels;
  };

  const chartdata = {
    labels: generateLabels(),
    datasets: [
      {
        label: '누적 답변 수',
        data: cumList,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      },
    ],
  };

const chartoptions: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: {
      type: 'category',
      grid: { display: false },
      ticks: {
        maxRotation: 45,
        minRotation: 45,
        align: 'end' as const,
        autoSkip: false,
      },
    },
    y: {
      type: 'linear',
      beginAtZero: true,
      ticks: {
        precision: 0, // 소수 제거
      },
    },
  },
};

  return (
    <div className="flex flex-col  text-center space-y-2">
      {/* 상단 버튼 */}
      <div className="flex space-x-2 justify-end mr-4">
        {['day', 'week', 'month'].map((option) => (
          <button
            key={option}
            onClick={() => setPeriodType(option as 'day' | 'week' | 'month')}
            className={`px-3 py-1 rounded-full text-sm ${
              periodType === option ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {option === 'day' ? '일별' : option === 'week' ? '주별' : '월별'}
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
