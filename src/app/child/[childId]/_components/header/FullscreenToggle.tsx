'use client';

import { FullScreenIcon } from '@/ui/icon/icon';
import { useState, useEffect, useCallback } from 'react';

/**
 * 브라우저의 Fullscreen API를 사용하여 전체 화면 모드로 진입하는 버튼입니다.
 * 전체 화면 상태에서는 버튼이 보이지 않습니다.
 */
export default function FullscreenToggle() {
  // 현재 전체 화면 상태를 추적하는 state
  const [isFullscreen, setIsFullscreen] = useState(false);
  // ✅ [추가] 컴포넌트가 클라이언트에서 마운트되었는지 확인하는 상태입니다.
  const [isMounted, setIsMounted] = useState(false);
  // 전체 화면 상태가 변경될 때마다(Esc 키 포함) state를 업데이트하는 useEffect
  useEffect(() => {
    // 이 useEffect는 클라이언트에서만 실행됩니다.
    // 마운트가 완료되었음을 알리고, 현재의 실제 전체 화면 상태를 즉시 확인하여 동기화합니다.
    setIsMounted(true);
    setIsFullscreen(!!document.fullscreenElement);

    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const enterFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`전체 화면 전환 실패: ${err.message}`);
      });
    }
  }, []);

  // ✅ [수정] isFullscreen 상태가 true이면, 아무것도 렌더링하지 않습니다(null).
  if (!isMounted || isFullscreen) {
    return null;
  }

  return (
    <button
      onClick={enterFullscreen}
      className="w-10 h-10 px-3.5 py-1 bg-white rounded-[10px] 
                 inline-flex justify-center items-center gap-3 overflow-hidden
                 transition-all hover:scale-105 active:scale-95"
      aria-label="전체 화면으로 보기"
      title="전체 화면으로 보기"
    >
      <FullScreenIcon/>
    </button>
  );
}
