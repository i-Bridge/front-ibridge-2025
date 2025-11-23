'use client';

import { ReactNode, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import ModalCard from '@/ui/Modal/ModalCard';
import ModalHeader from '@/ui/Modal/ModalHeader';
import ModalFooter from '@/ui/Modal/ModalFooter';
import { Text, type TextProps } from '@/ui/Text';
import PopupOverlay from '@/ui/Modal/PopupOverlay';

interface CommonModalProps {
  onClose?: () => void;
  children?: ReactNode;
  footerContent: ReactNode;
  title: string;
  titleLine2?: string;
  subtitle?: string;
  modalCardClassName?: string;
  footerClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  subtitleVariant?: TextProps<'span'>['variant'];
}

export default function CommonModalPopup({
  onClose,
  children,
  footerContent,
  title,
  titleLine2,
  subtitle,
  modalCardClassName,
  footerClassName,
  titleClassName,
  subtitleClassName,
  subtitleVariant,
}: CommonModalProps) {
  // 등장 애니메이션 상태
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 마운트 후 애니메이션 시작
    requestAnimationFrame(() => setIsVisible(true));
    
    // 스크롤 방지
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <PopupOverlay onClose={onClose ?? (() => {})}>
      <ModalCard
        hasBorder={false}
        className={twMerge(
          // -------------------------------------------------------------------
          // [ModalCard 기본 스타일 덮어쓰기 전략]
          // twMerge 덕분에 아래 클래스들이 ModalCard 내부의 기본 클래스(w-80 등)보다 우선 적용됨
          // -------------------------------------------------------------------
          "w-full min-w-[375px] ",

          // 2. 모서리 (Mobile: 위만 둥글게 / PC: 전체 둥글게 20px)
          // ModalCard의 기본 rounded-[40px]를 덮어씀
          "rounded-t-[20px] rounded-b-none md:rounded-[40px]",
          "gap-0 items-center overflow-hidden",

          // 4. 애니메이션 (모바일은 밑에서 올라옴, PC는 제자리 페이드인)
          "transform transition-all duration-300 ease-out",
          isVisible 
            ? "translate-y-0 opacity-100" 
            : "translate-y-full opacity-0 md:translate-y-0",

          modalCardClassName
        )}
      >
        {/* [모바일 전용 핸들바]
          피그마 디자인: 상단 회색 바 (Mobile Only)
          md:hidden으로 데스크탑에서는 숨김
        */}
        <div className="w-full h-6 bg-white flex justify-center items-center shrink-0 md:hidden pt-[10px] pb-[10px] rounded-t-[20px]">
           <div className="w-20 h-1 bg-grayscale-gray20 rounded-full" />
        </div>

        {/* 헤더 영역 (핸들바 유무에 따라 패딩 조정) */}
        <ModalHeader className="">
          <div className="flex flex-col justify-center items-center text-center gap-3">
            <div>
            <Text as="div" variant="title02" className={titleClassName}>
              {title}
            </Text>
            {titleLine2 && (
              <Text as="div" variant="title02" className={titleClassName}>
                {titleLine2}
              </Text>
              
            )}</div>
            {subtitle && (
              <Text
                as="div"
                variant={subtitleVariant ?? 'body03'}
                className={twMerge('text-grayscale-gray70 ', subtitleClassName)}
              >
                {subtitle}
              </Text>
            )}
          </div>
        </ModalHeader>

        {/* 컨텐츠 영역 */}
        {children}

        {/* 푸터 영역 (Shadow 효과 추가 - 피그마 참조) */}
        <div className="w-full md:p-5 shadow-sm z-10 bg-white">
          <ModalFooter className={footerClassName}>
             {footerContent}
          </ModalFooter>
        </div>
      </ModalCard>
    </PopupOverlay>
  );
}