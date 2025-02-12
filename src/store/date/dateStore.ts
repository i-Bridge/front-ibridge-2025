// src/store/DateStore.ts
// 선택된 날짜 상태 관리
import { create } from "zustand";

interface DateState {
  selectedDate: string; // 객체 대신 문자열
  setSelectedDate: (date: string) => void;
}

const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD" 형식

export const useDateStore = create<DateState>((set) => ({
  selectedDate: today,
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
