'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * 브라우저의 Fullscreen API를 사용하여 전체 화면 모드로 진입하는 버튼입니다.
 * 전체 화면 상태에서는 버튼이 보이지 않습니다.
 */
export default function FullscreenToggle() {
  // 현재 전체 화면 상태를 추적하는 state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 전체 화면 상태가 변경될 때마다(Esc 키 포함) state를 업데이트하는 useEffect
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // ✅ [수정] 이제 함수는 전체 화면으로 '진입'하는 역할만 담당합니다.
  const enterFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`전체 화면 전환 실패: ${err.message}`);
      });
    }
  }, []);

  // ✅ [수정] isFullscreen 상태가 true이면, 아무것도 렌더링하지 않습니다(null).
  if (isFullscreen) {
    return null;
  }

  // ✅ [수정] 전체 화면이 아닐 때만 버튼을 렌더링합니다.
  return (
    <button
      onClick={enterFullscreen}
      className="p-3 bg-white/70 rounded-full shadow-lg hover:bg-white active:scale-95 transition-all"
      aria-label="전체 화면으로 보기"
      title="전체 화면으로 보기"
    >
      {/* 항상 '확대' 아이콘만 보여줍니다. */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-8 h-8 text-gray-700"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9M20.25 20.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
        />
      </svg>
    </button>
  );
}
