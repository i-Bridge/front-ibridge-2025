// /lib/stores/gameStore.ts (있으면 생략)
import { create } from 'zustand';

type GameState = {
  coins: number;
  addCoins: (v: number) => void;
};

export const useGameStore = create<GameState>((set) => ({
  coins: 0,
  addCoins: (v) => set((s) => ({ coins: Math.max(0, s.coins + v) })),
}));
