'use client';

import { motion } from 'framer-motion';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import AvatarIcon from '../../../../ui/icon/AvatarIcons';
import { Text } from '@/ui/Text';
import CommonModalPopup from '@/ui/Modal/CommonModalPopup';
import { Button } from '@/ui/Button';

type QuestionItem = {
  ai: string;
  user: string | null;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  history: QuestionItem[];
};

export default function HistoryModal({ isOpen, onClose, history }: Props) {
  

  // --- 스크롤 디자인 및 블러 로직 ---
  const scrollRef = useRef<HTMLDivElement>(null);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);

  
  const handleScroll = useCallback(() => {
   
    const element = scrollRef.current;
    if (!element) return;

    

    const { scrollTop, scrollHeight, clientHeight } = element;
    
    // 커스텀 스크롤바 높이 계산
    const ratio = clientHeight / scrollHeight;
    const minHeight = 40; // 최소 높이
    const calculatedHeight = Math.max(clientHeight * ratio, minHeight);
    
    // 커스텀 스크롤바 위치 계산
    const trackHeight = clientHeight;
    const scrollableDistance = scrollHeight - clientHeight;
    const thumbMovableDistance = trackHeight - calculatedHeight;
    const scrollRatio =
      scrollableDistance > 0 ? scrollTop / scrollableDistance : 0;
    const calculatedTop = scrollRatio * thumbMovableDistance;

    setThumbHeight(calculatedHeight);
    setThumbTop(calculatedTop);
    
    // 블러 효과 제어를 위한 스크롤 끝 도달 여부 계산
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
  }, [handleScroll, isOpen]);

  const isScrollable = useMemo(() => {
    const element = scrollRef.current;
    if (!element) return false;
    return element.scrollHeight > element.clientHeight;
  }, [thumbHeight]); 

   

  
  const scrollbarHiddenStyles = {
    // 기본 스크롤바를 숨겨서 커스텀 스크롤바만 보이도록 함
    scrollbarWidth: 'none', 
    msOverflowStyle: 'none',
  } as React.CSSProperties;
  // ------------------------------------------
if (!isOpen) return null;
  return (
    <CommonModalPopup
      title="이전 대화 기록"
      modalCardClassName={twMerge('w-[600px] flex flex-col gap-0', 'flex-grow ')}
      onClose={onClose}
      footerContent={
        <Button onClick={onClose} className="h-14" variant={'grayscale'}>
          닫기
        </Button>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.2 }}
        // 대화 영역 전체 컨테이너: 높이 고정 및 relative
        className="w-full relative flex overflow-hidden h-[450px]" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. 실제 대화 스크롤 영역 */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 p-6 space-y-6 overflow-y-scroll"
          style={scrollbarHiddenStyles} // 기본 스크롤바 숨김
        >
          {history.map((item, index) => (
            <div key={index} className="flex flex-col gap-4">
              {/* AI 대화 (왼쪽) */}
              <div className="flex items-start gap-3">
                <AvatarIcon className="w-16 h-16 rounded-full flex-shrink-0 text-primary" />
                <div className="bg-primary-primary p-4 rounded-[20px] max-w-[80%]">
                  <Text variant={'body02'} className="text-white">
                    {item.ai}
                  </Text>
                </div>
              </div>

              {/* 사용자 대화 (오른쪽) */}
              {item.user && (
                <div className="flex items-start justify-end gap-3">
                  <div className="bg-grayscale-gray80 p-4 rounded-[20px] max-w-[80%]">
                    <Text variant={'body02'} className="text-white">
                      {item.user}
                    </Text>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 2. 커스텀 스크롤바 영역 */}
        {isScrollable && (
          <div className="self-stretch p-2 flex justify-start items-start overflow-hidden flex-shrink-0 relative">
            {/* 스크롤 트랙 (배경) - CommonModalPopup의 흰색 배경과 구분하기 위해 투명하게 유지 */}
            <div className="w-1.5 h-full relative bg-transparent rounded-[999px]"></div>
            
            {/* 스크롤 썸 (움직이는 부분) */}
            <div
              className="absolute left-1/2 -translate-x-1/2 w-1.5 bg-grayscale-gray20 rounded-[999px] transition-transform duration-100 ease-out"
              style={{
                height: `${thumbHeight}px`,
                top: `${thumbTop}px`, 
              }}
            ></div>
          </div>
        )}

        {/* 3. 스크롤 그라데이션 오버레이 (하단 블러 효과) */}
        {isScrollable && (
          <div
            className={twMerge(`
              absolute bottom-0 left-0 w-full h-20 
              bg-gradient-to-t from-white to-white/0 
              transition-opacity duration-300 pointer-events-none z-10 
            `,
              isScrolledToBottom ? 'opacity-0' : 'opacity-100' // 스크롤이 끝에 닿으면 투명하게
            )}
          ></div>
        )}
      </motion.div>
    </CommonModalPopup>
  );
}