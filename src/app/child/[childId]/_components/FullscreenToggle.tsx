'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * 브라우저의 Fullscreen API를 사용하여 전체 화면 모드를 켜고 끄는 토글 버튼입니다.
 */
export default function FullscreenToggle() {
  // 현재 전체 화면 상태를 추적하는 state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 전체 화면 상태가 변경될 때마다 state를 업데이트하는 useEffect
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    // 컴포넌트가 사라질 때 이벤트 리스너를 제거합니다.
    return () =>
      document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // 전체 화면을 켜고 끄는 토글 함수
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`전체 화면 전환 실패: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);

  return (
    <button
      onClick={toggleFullscreen}
      className="p-3 bg-white/70 rounded-full shadow-lg hover:bg-white active:scale-95 transition-all"
      aria-label="전체 화면 토글"
      title="전체 화면 토글"
    >
      {isFullscreen ? (
        // 전체 화면일 때 (축소 아이콘)
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
            d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25"
          />
        </svg>
      ) : (
        // 전체 화면이 아닐 때 (확대 아이콘)
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
      )}
    </button>
  );
}
