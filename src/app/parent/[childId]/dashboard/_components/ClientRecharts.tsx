'use client';

// recharts의 모든 컴포넌트를 이 'use client' 파일에서 묶어서
// 다시 export (re-export) 합니다.
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';

// recharts의 타입들도 여기서 re-export 할 수 있습니다.
// (단, 타입은 빌드 시점에만 사용되므로 필수 사항은 아님)
export type { TooltipProps } from 'recharts';

export { ResponsiveContainer, PieChart, Pie, Cell, Tooltip };