'use client';

import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/store/useGameStore';
import GrapeCluster from './_components/GrapeCluster';

const GRAPES_PER_BUNCH = 6;
const toBunches = (g: number) => Math.floor(g / GRAPES_PER_BUNCH);

export default function RewardPage() {
  // 전역: 알(서버 원장 단위)
  const grapes = useGameStore((s) => s.grapes);

  // 로컬(연출)
  const [filled, setFilled] = useState(0); // 현재 클러스터에 채워진 알(0~6)
  const [localBunchGain, setLocalBunchGain] = useState(0); // 화면에서만 보이는 추가 송이
  const userTouchedRef = useRef(false); // 사용자가 버튼을 눌러 UI를 변경했는지

  // ✅ 상단 표시용 송이 수
  const displayBunches = useMemo(
    () => toBunches(grapes) + localBunchGain,
    [grapes, localBunchGain],
  );

  // ✅ 하이드레이션/서버 업데이트에 맞춰 filled 동기화(유저가 건드리기 전까지만)
  useEffect(() => {
    if (userTouchedRef.current) return; // 유저가 조작 시작하면 더 이상 자동 동기화 X
    setFilled(grapes % GRAPES_PER_BUNCH);
  }, [grapes]);

  // 버튼 조작시 플래그 세우기
  const touch = () => {
    userTouchedRef.current = true;
  };

  const enabled = filled >= GRAPES_PER_BUNCH;

  // 🎁 (연출) 한 송이 완성 시: 상단 +1송이, 알 UI 리셋
  const onClaim = useCallback(async () => {
    if (!enabled) return 0;
    touch();
    setLocalBunchGain((n) => n + 1);
    setFilled(0);
    return 1; // RewardChest 애니메이션용
  }, [enabled]);

  return (
    <section className="p-4 md:p-6">
      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">리워드</h1>

        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 border border-amber-200 px-3 py-1 text-sm text-amber-800">
          <span aria-label="bunch" role="img">
            🍇
          </span>
          <span className="font-semibold">포도 송이: {displayBunches}</span>
          <span className="text-gray-500">/ {grapes} 알</span>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 items-start">
        {/* 진행도 카드 */}
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6 flex flex-col items-center">
          <GrapeCluster filledCount={filled} size={56} />
          <div className="mt-4 text-center">
            <div className="text-lg font-semibold text-gray-800">
              {filled}/{GRAPES_PER_BUNCH} 알 채움
            </div>
            <div className="mt-1 text-sm text-gray-500">
              한 송이는 {GRAPES_PER_BUNCH}개의 포도알로 완성돼요.
            </div>

            <button
              type="button"
              onClick={onClaim}
              disabled={!enabled}
              className={[
                'mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-base font-semibold shadow-sm transition',
                enabled
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white animate-pulse'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed',
              ].join(' ')}
              aria-disabled={!enabled}
              aria-label="완성된 포도 한 송이 받기"
              title={
                enabled ? '완성된 포도 한 송이 받기' : '아직 포도알이 부족해요'
              }
            >
              <span aria-hidden>🎁</span>한 송이 받기
            </button>
          </div>
        </div>

        {/* 안내/설명 카드 (선택) */}
        <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-amber-50 border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800">어떻게 모을까요?</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-700 list-disc pl-5">
            <li>대화 미션을 완료하면 포도알을 얻어요.</li>
            <li>
              포도알 {GRAPES_PER_BUNCH}개를 모으면 <b>포도 한 송이</b>가
              완성돼요.
            </li>
            <li>
              완성되면 <b>🎁 한 송이 받기</b> 버튼으로 보상 상자에 담겨요.
            </li>
          </ul>

          <div className="mt-4 rounded-xl bg-white/70 border border-white px-4 py-3">
            <div className="text-sm text-gray-600">
              지금 상황: <b className="text-gray-800">{filled}</b> /{' '}
              {GRAPES_PER_BUNCH} 알
            </div>
            <div className="text-xs text-gray-500 mt-1">
              상단의 “포도 송이”는 누적 보상을 보기 쉽게 <b>화면 전용</b>으로 한
              송이씩 증가해요.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
