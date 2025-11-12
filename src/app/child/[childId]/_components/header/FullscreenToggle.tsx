'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/ui/Button';
import { FullscreenEnterIcon, FullscreenExitIcon } from '@/ui/icon/icon';

/** ===== 벤더 프리픽스 포함한 타입 보강 ===== */
type VendorDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => void | Promise<void>;
  mozFullScreenElement?: Element | null;
  mozCancelFullScreen?: () => void | Promise<void>;
  msFullscreenElement?: Element | null;
  msExitFullscreen?: () => void | Promise<void>;
};

type VendorElement = Element & {
  webkitRequestFullscreen?: () => void | Promise<void>;
  mozRequestFullScreen?: () => void | Promise<void>;
  msRequestFullscreen?: () => void | Promise<void>;
};

/** ===== 현재 전체화면 여부 (Safari 등 포함) ===== */
function isFullscreenNow(): boolean {
  const d = document as VendorDocument;
  return Boolean(
    document.fullscreenElement ??
      d.webkitFullscreenElement ??
      d.mozFullScreenElement ??
      d.msFullscreenElement,
  );
}

export default function FullscreenToggle() {
  const [isMounted, setIsMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsFullscreen(isFullscreenNow());

    const onChange = () => setIsFullscreen(isFullscreenNow());

    // 표준 + 벤더 이벤트 모두 바인딩
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener(
      'webkitfullscreenchange',
      onChange as EventListener,
    );
    document.addEventListener('mozfullscreenchange', onChange as EventListener);
    document.addEventListener('MSFullscreenChange', onChange as EventListener);

    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      document.removeEventListener(
        'webkitfullscreenchange',
        onChange as EventListener,
      );
      document.removeEventListener(
        'mozfullscreenchange',
        onChange as EventListener,
      );
      document.removeEventListener(
        'MSFullscreenChange',
        onChange as EventListener,
      );
    };
  }, []);

  const enterFullscreen = useCallback(() => {
    const el = document.documentElement as VendorElement;

    const req =
      el.requestFullscreen ??
      el.webkitRequestFullscreen ??
      el.mozRequestFullScreen ??
      el.msRequestFullscreen;

    if (req) {
      try {
        const maybePromise = req.call(el) as void | Promise<void>;
        // 일부 브라우저는 Promise를 반환
        if (
          maybePromise &&
          typeof (maybePromise as Promise<void>).then === 'function'
        ) {
          void (maybePromise as Promise<void>).catch((err: unknown) => {
            const msg = err instanceof Error ? err.message : String(err);
            console.warn('전체 화면 전환 실패:', msg);
          });
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn('전체 화면 전환 실패:', msg);
      }
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    const d = document as VendorDocument;

    const exit =
      document.exitFullscreen ??
      d.webkitExitFullscreen ??
      d.mozCancelFullScreen ??
      d.msExitFullscreen;

    if (exit) {
      try {
        const maybePromise = exit.call(document) as void | Promise<void>;
        if (
          maybePromise &&
          typeof (maybePromise as Promise<void>).then === 'function'
        ) {
          void (maybePromise as Promise<void>).catch((err: unknown) => {
            const msg = err instanceof Error ? err.message : String(err);
            console.warn('전체 화면 종료 실패:', msg);
          });
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn('전체 화면 종료 실패:', msg);
      }
    }
  }, []);

  if (!isMounted) return null;

  return isFullscreen ? (
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
