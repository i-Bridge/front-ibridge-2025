'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';

const ITEMS = [
  { id: 1, name: '에너지 포션', costBunch: 1 },
  { id: 2, name: '스티커 팩', costBunch: 2 },
  { id: 3, name: '테마 스킨', costBunch: 3 },
];

export default function StorePage() {
  const grapeBunches = useGameStore((s) => s.grapeBunches);
  const spendBunches = useGameStore((s) => s.spendBunches);
  const [logs, setLogs] = useState<string[]>([]);

  const buy = (id: number) => {
    const item = ITEMS.find((i) => i.id === id);
    if (!item) return;
    const ok = spendBunches(item.costBunch);
    setLogs((prev) => [
      `${new Date().toLocaleTimeString()} - ${item.name} ${ok ? '구매 성공' : '구매 실패(송이 부족)'}`,
      ...prev,
    ]);
  };

  return (
    <section className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">상점</h1>
        <div className="rounded-lg bg-white/10 px-3 py-1 text-sm">
          🍇: <b>{grapeBunches}</b>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((it) => (
          <div
            key={it.id}
            className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
          >
            <div className="font-semibold">{it.name}</div>
            <div className="opacity-80 text-sm mt-1">
              가격: {it.costBunch} 송이
            </div>
            <button
              onClick={() => buy(it.id)}
              className="mt-3 w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-rose-500 py-2 font-semibold hover:brightness-105"
            >
              구매
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-white/5 p-3 text-sm max-h-48 overflow-auto">
        <div className="font-semibold mb-2">로그</div>
        <ul className="space-y-1">
          {logs.map((l, i) => (
            <li key={i} className="opacity-80">
              {l}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
