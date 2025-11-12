'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/ui/Button';
import { FullscreenEnterIcon, FullscreenExitIcon } from '@/ui/icon/icon'; // 아이콘 이름 합의대로

// 사파리 호환을 포함한 전체화면 감지 헬퍼
function isFullscreenNow(): boolean {
  const d = document as any;
  return !!(
    document.fullscreenElement ||
    d.webkitFullscreenElement || // Safari
    d.mozFullScreenElement || // (레거시 파폭)
    d.msFullscreenElement // (레거시 IE/Edge)
  );
}

export default function FullscreenToggle() {
  const [isMounted, setIsMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsFullscreen(isFullscreenNow());

    const onChange = () => setIsFullscreen(isFullscreenNow());
    document.addEventListener('fullscreenchange', onChange as EventListener);
    // 사파리 등 벤더 이벤트(일부 브라우저는 동일 이벤트로만 동작)
    document.addEventListener(
      'webkitfullscreenchange',
      onChange as EventListener,
    );

    return () => {
      document.removeEventListener(
        'fullscreenchange',
        onChange as EventListener,
      );
      document.removeEventListener(
        'webkitfullscreenchange',
        onChange as EventListener,
      );
    };
  }, []);

  const enterFullscreen = useCallback(() => {
    const el = document.documentElement as any;
    const req =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullscreen;

    if (typeof req === 'function') {
      Promise.resolve(req.call(el)).catch((err: any) =>
        console.warn('전체 화면 전환 실패:', err?.message || err),
      );
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    const d = document as any;
    const exit =
      document.exitFullscreen ||
      d.webkitExitFullscreen ||
      d.mozCancelFullScreen ||
      d.msExitFullscreen;

    if (typeof exit === 'function') {
      Promise.resolve(exit.call(document)).catch((err: any) =>
        console.warn('전체 화면 종료 실패:', err?.message || err),
      );
    }
  }, []);

  if (!isMounted) return null;

  return isFullscreen ? (
    // 전체화면 상태: "종료" 버튼 노출
    <Button
      onClick={exitFullscreen}
      className="w-10 h-10 px-3.5 py-1 bg-grayscale-gray10 rounded-[10px] justify-center items-center"
      aria-label="전체 화면 종료"
      title="전체 화면 종료"
      data-state="fullscreen"
    >
      <FullscreenExitIcon />
    </Button>
  ) : (
    // 일반 상태: "전체화면 진입" 버튼 노출
    <Button
      onClick={enterFullscreen}
      className="w-10 h-10 px-3.5 py-1 bg-grayscale-gray10 rounded-[10px] justify-center items-center"
      aria-label="전체 화면으로 보기"
      title="전체 화면으로 보기"
      data-state="windowed"
    >
      <FullscreenEnterIcon />
    </Button>
  );
}
