import { create } from 'zustand';

type CurrencyState = {
  grapeBunches: number; // 보유 포도 송이 개수
  addBunches: (v: number) => void; // 보상 수령 등
  spendBunches: (v: number) => boolean; // 구매 시 사용(성공/실패 반환)
  reset: () => void;
};

export const useGameStore = create<CurrencyState>((set, get) => ({
  grapeBunches: 0,
  addBunches: (v) =>
    set((s) => ({ grapeBunches: Math.max(0, s.grapeBunches + v) })),
  spendBunches: (v) => {
    const curr = get().grapeBunches;
    if (curr < v) return false;
    set({ grapeBunches: curr - v });
    return true;
  },
  reset: () => set({ grapeBunches: 0 }),
}));
