'use client';

import { useMemo, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';

const ITEMS = [
  { id: 1, name: '에너지 포션', costBunch: 1 },
  { id: 2, name: '스티커 팩', costBunch: 2 },
  { id: 3, name: '테마 스킨', costBunch: 3 },
];

const GRAPES_PER_BUNCH = 6;
const toBunches = (g: number) => Math.floor(g / GRAPES_PER_BUNCH);

export default function StorePage() {
  // 전역: 알(원장 단위) — SSR 레이아웃에서 하이드레이트됨
  const grapes = useGameStore((s) => s.grapes);
  // const setGrapes = useGameStore((s) => s.setGrapes); // 실제 결제 붙일 때 사용

  // 연출 전용: 화면상 잔액 증감
  const [localBunchGain] = useState(0); // (필요 시 이벤트로 +가 생기면 사용)
  const [localBunchSpend, setLocalBunchSpend] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  // 표시 잔액(송이) = 전역 알→송이 + 연출 증감
  const baseBunches = useMemo(() => toBunches(grapes), [grapes]);
  const displayBunches = useMemo(
    () => Math.max(0, baseBunches + localBunchGain - localBunchSpend),
    [baseBunches, localBunchGain, localBunchSpend],
  );

  const buy = (id: number) => {
    const item = ITEMS.find((i) => i.id === id);
    if (!item) return;

    const enough = displayBunches >= item.costBunch;
    if (!enough) {
      setLogs((prev) => [
        `${new Date().toLocaleTimeString()} - ${item.name} 구매 실패(송이 부족)`,
        ...prev,
      ]);
      return;
    }

    // ✅ 연출 전용 차감: 전역 grapes는 건드리지 않음
    setLocalBunchSpend((n) => n + item.costBunch);

    // ⚠️ 실제 결제 연결 시:
    // const res = await Fetcher(`/child/${childId}/store/purchase`, { method:'POST', data:{ itemId:id }});
    // if (res.isSuccess) setGrapes(res.data.grape); else 롤백 처리 등…

    setLogs((prev) => [
      `${new Date().toLocaleTimeString()} - ${item.name} 구매 성공`,
      ...prev,
    ]);
  };

  return (
    <section className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">상점</h1>
        <div className="rounded-lg bg-white/10 px-3 py-1 text-sm">
          🍇: <b>{displayBunches}</b>{' '}
          <span className="opacity-70">({grapes} 알)</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((it) => {
          const disabled = displayBunches < it.costBunch;
          return (
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
                disabled={disabled}
                className={`mt-3 w-full rounded-xl py-2 font-semibold hover:brightness-105 transition
                  ${disabled ? 'bg-white/15 cursor-not-allowed' : 'bg-gradient-to-r from-fuchsia-500 to-rose-500'}
                `}
              >
                {disabled ? '잔액 부족' : '구매'}
              </button>
            </div>
          );
        })}
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
