'use client';

import Header, { ChatHistoryIcon, CloseIcon } from '../_components/Header';
import { useRouter, useParams } from 'next/navigation';
import { useChildStore } from '@/store/useChildStore';
import type { ReactNode } from 'react';

export default function QuestionLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const { childId } = params;

  // ✅ [추가] 스토어에서 모달을 여는 함수를 가져옵니다.
  const setHistoryModalOpen = useChildStore((s) => s.setHistoryModalOpen);
  const setExitModalOpen = useChildStore((s) => s.setExitModalOpen);

  return (
    <div>
      <Header
        center={<h1 className="text-lg font-bold">토크</h1>}
        right={
          <>
            {/* ✅ [수정] onClick 이벤트를 추가하여 스토어의 모달 상태를 true로 변경합니다. */}

            <button
              aria-label="이전 대화 기록"
              onClick={() => setHistoryModalOpen(true)}
            >
              <ChatHistoryIcon />
            </button>
            {/* ✅ [수정] 닫기 버튼에도 onClick 이벤트를 추가하여 /talk 페이지로 이동시킵니다. */}
            <button aria-label="닫기" onClick={() => setExitModalOpen(true)}>
              <CloseIcon />
            </button>
          </>
        }
      />
      <main>{children}</main>
    </div>
  );
}
