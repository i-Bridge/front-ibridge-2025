// components/ExitModal.tsx (파일 경로 예시)

'use client';

import { motion } from 'framer-motion';
// ✅ AvatarAiIcon의 실제 경로로 수정해 주세요.
import { AvatarAiIcon } from './AvatarIcons';

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
          <AvatarAiIcon className="w-20 h-20 flex-shrink-0" />

          {/* 1.2. 텍스트 */}
          <h3 className="font-extrabold text-[28px] leading-[140%] text-gray-90 text-center">
            대화를 종료할 거야?
          </h3>
        </div>

        {/* ✅ 2. 밑 Div (버튼) */}
        <div className="w-full h-[104px] flex flex-col justify-center p-5">
          {/* 2.1. 버튼 그룹 */}
          <div className="w-full flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-5 bg-grayscale-gray10 text-gray-70 font-extrabold rounded-full hover:bg-grayscale-gray20 transition-colors text-base"
            >
              계속 대화하기
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-5 bg-primary-primary text-white font-extrabold rounded-full hover:bg-orange-600 transition-colors text-base"
            >
              종료하기
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
