'use client';

import type { ReactNode } from 'react';
import ModalCard from '@/ui/Modal/ModalCard';
import ModalHeader from '@/ui/Modal/ModalHeader';
import ModalFooter from '@/ui/Modal/ModalFooter';
import { Text } from '@/ui/Text';
import PopupOverlay from '@/ui/Modal/PopupOverlay';


interface CommonModalProps {
  /**
   * 모달을 닫아야 할 때 호출되는 함수입니다.
   * (예: 오버레이 클릭, 취소 버튼 클릭)
   */
  onClose: () => void;
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
}

/**
 * 프로젝트 전역에서 사용되는 공용 모달 래퍼 컴포넌트입니다.
 * `PopupOverlay`, `ModalCard`, `ModalHeader`, `ModalFooter`를 조합하여
 * 일관된 모달 UI를 제공합니다.
 *
 * @example
 * // 1. 한 줄 제목 모달
 * <CommonModal
 * title="삭제 확인"
 * onClose={handleCloseModal}
 * {...}
 * />
 *
 * // 2. 두 줄 제목 모달 (title + titleLine2)
 * <CommonModal
 * title="해당 이름의 집이"
 * titleLine2="이미 존재합니다."
 * onClose={handleCloseDeleteModal}
 * {...}
 * />
 *
 * // 3. 두 줄 제목 + 부제목 모달
 * <CommonModal
 * title="정말로 삭제하시겠습니까?"
 * titleLine2="복구할 수 없습니다."
 * subtitle="자녀 정보가 영구히 삭제됩니다."
 * onClose={handleCloseDeleteModal}
 * {...}
 * />
 **/
export default function CommonModalPopup({
  onClose,
  children,
  footerContent,
  title,
  titleLine2, // 새로 추가된 prop
  subtitle,
  footerClassName,
  titleClassName,
  subtitleClassName,
}: CommonModalProps) {
  return (
    <PopupOverlay onClose={onClose}>
      <ModalCard hasBorder={false} className='w-[480px] flex flex-col gap-0'>
        {/* 헤더 영역 */}
        <ModalHeader>
          {/* 첫 번째 제목 줄 */}
          <div className='flex flex-col justify-center items-center'>
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
            <Text as="div" variant="body03" className={subtitleClassName}>
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