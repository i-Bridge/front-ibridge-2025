// src/store/DateStore.ts
// 선택된 날짜 상태 관리

import { create } from "zustand";

interface DateState {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export const useDateStore = create<DateState>((set) => ({
  selectedDate: new Date().toISOString().split('T')[0], // 오늘 날짜로 초기화
  setSelectedDate: (date) => set({ selectedDate: date }),
}));