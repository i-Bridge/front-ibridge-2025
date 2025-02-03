export type Period = '매주' | '매월';

export interface Question {
  id: number;
  content: string;
}

export interface PeriodicQuestion {
  id: number;
  content: string;
  period: Period;
}
