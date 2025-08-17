// app/child/[childId]/store/page.tsx
'use client';

import { useState } from 'react';

export default function StorePage() {
  const [coins, setCoins] = useState(200);
  const items = [
    { id: 1, name: '에너지 +20', price: 50 },
    { id: 2, name: '코인 더블(1회)', price: 150 },
  ];

  return (
    <section className="p-2">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">상점</h2>
        <div className="rounded-lg bg-white/10 px-3 py-1">🪙 {coins}</div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.id}
            className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10"
          >
            <div className="font-semibold">{it.name}</div>
            <div className="opacity-70 text-sm mt-1">가격: {it.price}🪙</div>
            <button
              onClick={() => setCoins((c) => Math.max(0, c - it.price))}
              className="mt-3 w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-rose-500 py-2 font-semibold hover:brightness-105"
            >
              구매
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
