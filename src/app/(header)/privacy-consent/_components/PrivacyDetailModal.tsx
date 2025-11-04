'use client';

import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Text } from '@/ui/Text';
import { Button } from '@/ui/Button';
import CommonModal from '@/ui/Modal/CommonModalPopup';

interface PrivacyDetailModalProps {
  /** 모달 닫기 핸들러 함수 */
  onClose: () => void;
  /** 동의 항목 제목 */
  title: string;
  /** 약관의 실제 내용 (부모 컴포넌트에서 전달받음) */
  content: string;
}

export default function PrivacyDetailModal({
  onClose,
  title,
  content,
}: PrivacyDetailModalProps) {
  // --- 스크롤 관련 로직 (원본과 동일) ---
  const scrollRef = useRef<HTMLDivElement>(null);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  const handleScroll = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;

    const { scrollTop, scrollHeight, clientHeight } = element;
    const ratio = clientHeight / scrollHeight;
    const minHeight = 40;
    const calculatedHeight = Math.max(clientHeight * ratio, minHeight);
    const trackHeight = clientHeight;
    const scrollableDistance = scrollHeight - clientHeight;
    const thumbMovableDistance = trackHeight - calculatedHeight;
    const scrollRatio =
      scrollableDistance > 0 ? scrollTop / scrollableDistance : 0;
    const calculatedTop = scrollRatio * thumbMovableDistance;

    setThumbHeight(calculatedHeight);
    setThumbTop(calculatedTop);
    setIsScrolledToBottom(
      Math.abs(scrollHeight - (scrollTop + clientHeight)) < 1,
    );
  }, []);

  useEffect(() => {
    handleScroll();
    const element = scrollRef.current;

    const resizeObserver = new ResizeObserver(handleScroll);
    if (element) {
      element.addEventListener('scroll', handleScroll);
      resizeObserver.observe(element);
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
        resizeObserver.unobserve(element);
      }
    };
  }, [handleScroll]);

  const scrollbarStyles = {
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  }as React.CSSProperties;

  const isScrollable = useMemo(() => {
    const element = scrollRef.current;
    if (!element) return false;
    return element.scrollHeight > element.clientHeight;
  }, [thumbHeight]); // 원본 의존성 배열 유지

  // --- 렌더링 ---
  return (
    <CommonModal
      title={title}
      onClose={onClose}
      footerContent={
        <Button variant={'primary'} onClick={onClose} className='h-16'>
          확인
        </Button>
      }
    >
      {/* 💡 CommonModal의 children prop으로 약관 본문 영역 전달
        CommonModal의 JSDoc에 따라 이 children 내부에서
        h-[480px] 및 스크롤 영역의 패딩(px-7 py-5)을 직접 관리합니다.
      */}
      <div className="h-[450px] inline-flex justify-start items-start overflow-hidden relative w-full">
        {/* 약관 텍스트 */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 self-stretch px-7 py-5 flex justify-start items-start gap-2.5 overflow-y-scroll"
          style={scrollbarStyles}
        >
          <Text
            variant="body04"
            className="flex-1 whitespace-pre-wrap text-grayscale-gray70"
          >
            {content}
          </Text>
        </div>

        {/* 커스텀 스크롤바 */}
        {isScrollable && (
          <div className="self-stretch p-2 flex justify-start items-start overflow-hidden flex-shrink-0 relative">
            <div className="w-1.5 h-full relative bg-white rounded-[999px]"></div>
            <div
              className="absolute left-1/2 -translate-x-1/2 w-1.5 bg-grayscale-gray20 rounded-[999px] transition-transform duration-100 ease-out"
              style={{
                height: `${thumbHeight}px`,
                top: `calc(${thumbTop}px + 0.5rem)`, // p-2(0.5rem) 만큼 상단 위치 조정
              }}
            ></div>
          </div>
        )}

        {/* 스크롤 그라데이션 오버레이 */}
        {isScrollable && (
          <div
            className={`
              absolute bottom-0 left-0 w-full h-20 
              bg-gradient-to-t from-white to-white/0 
              transition-opacity duration-300 pointer-events-none
              ${isScrolledToBottom ? 'opacity-0' : 'opacity-100'} 
            `}
          ></div>
        )}
      </div>
    </CommonModal>
  );
}
