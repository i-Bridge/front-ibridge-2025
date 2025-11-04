// components/ExitModal.tsx (파일 경로 예시)

'use client';

import { motion } from 'framer-motion';
import AvatarIcon from '../AvatarIcons';
import { Button } from '@/ui/Button';
import ModalFooter from '@/ui/Modal/ModalFooter';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ExitModal({ isOpen, onClose, onConfirm }: Props) {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      className="absolute inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose} // 배경 클릭 시 닫기
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="w-[482px] bg-white rounded-[40px] shadow-xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫힘 방지
      >
        {/* ✅ 1. 윗 Div (아이콘 + 텍스트) */}
        <div className="w-full h-[207px] flex flex-col items-center gap-5 pt-[48px] pb-5">
          {/* ✅ [수정] 아이콘을 감싸던 배경 div 제거 */}
          {/* 아이콘 크기를 w-20 h-20으로 조정하고, text-orange-500 적용 */}
          <AvatarIcon className="w-20 h-20 flex-shrink-0" />

          {/* 1.2. 텍스트 */}
          <h3 className="font-extrabold text-[28px] leading-[140%] text-gray-90 text-center">
            대화를 종료할 거야?
          </h3>
        </div>

        {/* 2.1. 버튼 그룹 */}
        <ModalFooter className="">
          <Button
            onClick={onClose}
            variant={'grayscale'}
            className=""
            textVariant={'caption02'}
          >
            계속 대화하기
          </Button>
          <Button
            onClick={onConfirm}
            variant={'primary'}
            className=""
            textVariant={'caption02'}
          >
            종료하기
          </Button>
        </ModalFooter>
      </motion.div>
    </div>
  );
}
