'use client';

// [1] useEffect를 import 합니다.
import { ReactNode, useEffect } from 'react';
import ModalCard from '@/ui/Modal/ModalCard';
import ModalHeader from '@/ui/Modal/ModalHeader';
import ModalFooter from '@/ui/Modal/ModalFooter';
import { Text, type TextProps } from '@/ui/Text';
import PopupOverlay from '@/ui/Modal/PopupOverlay';
import { twMerge } from 'tailwind-merge';

interface CommonModalProps {
  /**
   * 모달을 닫아야 할 때 호출되는 함수입니다.
   * (예: 오버레이 클릭, 취소 버튼 클릭)
   */
  onClose?: () => void;
  /**
   * 모달의 메인 바디 영역에 렌더링될 React 노드입니다.
   * `p-10` 등 내부 패딩은 이 `children`에서 직접 지정해야 합니다.
   */
  children?: ReactNode;
  /**
   * 모달 푸터 영역에 렌더링될 커스텀 React 노드입니다.
   * (예: `<Button />` 컴포넌트의 배열)
   */
  footerContent: ReactNode;

  /**
   * 모달 헤더에 표시될 메인 제목 텍스트 (첫 번째 줄)입니다.
   * 내부적으로 `Text` 컴포넌트의 `title02` variant를 사용합니다.
   */
  title: string;
  /**
   * (선택 사항) 모달 헤더에 표시될 제목 텍스트 (두 번째 줄)입니다.
   * 이 prop을 제공하면 `title`과 동일한 `title02` 스타일로 렌더링됩니다.
   */
  titleLine2?: string;
  /**
   * (선택 사항) 모달 헤더의 제목(들) 아래에 표시될 부제목 텍스트입니다.
   * 내부적으로 `Text` 컴포넌트의 `body03` variant를 사용합니다.
   */
  subtitle?: string;

  modalCardClassName?: string;
  /**
   * (선택 사항) `ModalFooter` 컴포넌트에 적용할 추가 Tailwind CSS 클래스입니다.
   * `tailwind-merge`에 의해 기존 스타일과 병합됩니다.
   */
  footerClassName?: string;
  /**
   * (선택 사항) `title` 및 `titleLine2`를 렌더링하는 `Text` 컴포넌트에 적용할 추가 Tailwind CSS 클래스입니다.
   */
  titleClassName?: string;
  /**
   * (선택 사항) `subtitle`을 렌더링하는 `Text` 컴포넌트에 적용할 추가 Tailwind CSS 클래스입니다.
   */
  subtitleClassName?: string;
  /**
   * (선택 사항) `subtitle`을 렌더링하는 `Text` 컴포넌트의 variant입니다.
   * 제공되지 않으면 'body03'이 기본값으로 사용됩니다.
   * @default 'body03'
   */
  subtitleVariant?: TextProps<'span'>['variant'];
}

/**
 * 프로젝트 전역에서 사용되는 공용 모달 래퍼 컴포넌트입니다.
 * ( ... JSDoc ... )
 **/
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
  // [2] ✨ 배경 스크롤 방지 로직 추가
  useEffect(() => {
    // 1. 현재 body의 overflow 스타일을 저장합니다.
    const originalOverflow = document.body.style.overflow;

    // 2. 모달이 열릴 때 body의 스크롤을 막습니다.
    document.body.style.overflow = 'hidden';

    // 3. 모달이 닫힐 때(unmount) body의 overflow 스타일을
    //    원래대로 복구합니다.
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []); // 이 효과는 모달이 마운트/언마운트될 때 한 번만 실행됩니다.

  return (
    <PopupOverlay onClose={onClose ?? (() => {})}>
      <ModalCard
        hasBorder={false}
        className={twMerge(
          'flex flex-col gap-0',
          modalCardClassName,
        )}
      >
        {/* 헤더 영역 */}
        <ModalHeader>
          {/* 첫 번째 제목 줄 */}
          <div className="flex flex-col justify-center items-center ">
            <Text as="div" variant="title02" className={titleClassName}>
              {title}
            </Text>
            {/* (선택 사항) 두 번째 제목 줄 */}
            {titleLine2 && (
              <Text as="div" variant="title02" className={titleClassName}>
                {titleLine2}
              </Text>
            )}
          </div>
          {/* (선택 사항) 부제목 */}
          {subtitle && (
            <Text
              as="div"
              variant={subtitleVariant ?? 'body03'}
              className={twMerge('text-grayscale-gray70', subtitleClassName)}
            >
              {subtitle}
            </Text>
          )}
        </ModalHeader>

        {children}

        <ModalFooter className={footerClassName}>{footerContent}</ModalFooter>
      </ModalCard>
    </PopupOverlay>
  );
}