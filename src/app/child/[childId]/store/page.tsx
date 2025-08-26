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
  // 전역: 알(원장 단위)
  const grapes = useGameStore((s) => s.grapes);
  // const setGrapes = useGameStore((s) => s.setGrapes); // 실제 결제 붙일 때 사용

  // 연출 전용
  const [localBunchGain] = useState(0);
  const [localBunchSpend, setLocalBunchSpend] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  // 표시 잔액(송이)
  const baseBunches = useMemo(() => toBunches(grapes), [grapes]);
  const displayBunches = useMemo(
    () => Math.max(0, baseBunches + localBunchGain - localBunchSpend),
    [baseBunches, localBunchGain, localBunchSpend],
  );

  const buy = (id: number) => {
    const item = ITEMS.find((i) => i.id === id);
    if (!item) return;

    const enough = displayBunches >= item.costBunch;
    const time = new Date().toLocaleTimeString();

    if (!enough) {
      setLogs((prev) => [
        `${time} - ${item.name} 구매 실패(송이 부족)`,
        ...prev,
      ]);
      return;
    }

    // ✅ 연출 전용 차감
    setLocalBunchSpend((n) => n + item.costBunch);

    // ⚠️ 실제 결제 연결 시 서버 반영 & 롤백 처리
    // const res = await Fetcher(`/child/${childId}/store/purchase`, { method:'POST', data:{ itemId:id }});
    // if (res.isSuccess) setGrapes(res.data.grape); else setLocalBunchSpend((n)=>n - item.costBunch)

    setLogs((prev) => [`${time} - ${item.name} 구매 성공`, ...prev]);
  };

  return (
    <section className="p-4 md:p-6">
      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">상점</h1>
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 border border-amber-200 px-3 py-1 text-sm text-amber-800">
          <span aria-label="grape" role="img">
            🍇
          </span>
          <span className="font-semibold">{displayBunches} 송이</span>
          <span className="text-gray-500">/ {grapes} 알</span>
        </div>
      </div>

      {/* 아이템 그리드 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((it) => {
          const disabled = displayBunches < it.costBunch;
          return (
            <div
              key={it.id}
              className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5 flex flex-col"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-gray-800">{it.name}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    가격: <b className="text-gray-700">{it.costBunch} 송이</b>
                  </div>
                </div>
                <div className="rounded-full bg-purple-50 text-purple-700 text-xs px-2 py-1 border border-purple-100">
                  🧺 상점
                </div>
              </div>

              <button
                onClick={() => buy(it.id)}
                disabled={disabled}
                className={[
                  'mt-4 w-full rounded-xl py-2.5 font-semibold transition shadow-sm',
                  disabled
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-violet-400 to-sky-400 hover:from-violet-500 hover:to-sky-500 text-white',
                ].join(' ')}
                aria-disabled={disabled}
                aria-label={
                  disabled
                    ? `${it.name} 구매 불가: 잔액 부족`
                    : `${it.name} 구매`
                }
                title={disabled ? '잔액이 부족해요' : '구매하기'}
              >
                {disabled ? '잔액 부족' : '구매'}
              </button>
            </div>
          );
        })}
      </div>

      {/* 로그 */}
      <div className="mt-6 rounded-2xl bg-white border border-gray-200 shadow-sm p-4 text-sm max-h-56 overflow-auto">
        <div className="font-semibold text-gray-800 mb-2">구매 로그</div>
        {logs.length === 0 ? (
          <p className="text-gray-500">
            아직 로그가 없어요. 아이템을 구매해보세요!
          </p>
        ) : (
          <ul className="space-y-1">
            {logs.map((l, i) => (
              <li key={i} className="text-gray-600">
                {l}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
