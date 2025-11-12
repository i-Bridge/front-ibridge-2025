// components/ExitModal.tsx (파일 경로 예시)

'use client';

import { motion } from 'framer-motion';
import AvatarIcon from '../../../../../ui/icon/AvatarIcons';
import { Button } from '@/ui/Button';
import ModalFooter from '@/ui/Modal/ModalFooter';
import ModalHeader from '@/ui/Modal/ModalHeader';
import { Text } from '@/ui/Text';
import PopupOverlay from '@/ui/Modal/PopupOverlay';
import ModalCard from '@/ui/Modal/ModalCard';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ChatExitModal({ isOpen, onClose, onConfirm }: Props) {
  if (!isOpen) return null;

  return (
    // Backdrop
    <PopupOverlay onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className=""
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()} // 모달 내부 클릭 시 닫힘 방지
      >
        <ModalCard hasBorder={false} className="gap-0">
          <ModalHeader className="gap-4">
            <AvatarIcon className="w-20 h-20 flex-shrink-0" />
            <Text variant={'title02'} className="text-center">
              대화를 종료할 거야?
            </Text>
          </ModalHeader>

          {/* 2.1. 버튼 그룹 */}
          <ModalFooter>
            <Button
              onClick={onClose}
              variant={'grayscale'}
              textVariant={'caption02'}
            >
              계속 대화하기
            </Button>
            <Button
              onClick={onConfirm}
              variant={'primary'}
              textVariant={'caption02'}
            >
              종료하기
            </Button>
          </ModalFooter>
        </ModalCard>
      </motion.div>
    </PopupOverlay>
  );
}
