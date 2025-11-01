'use client';

import { motion } from 'framer-motion';
import AvatarIcon from './AvatarIcons';

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
  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.2 }}
        className="w-[90vw] max-w-lg h-[70vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-grayscale-gray80 text-center py-5 flex-shrink-0 border-b">
          이전 대화 기록
        </h3>

        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {history.map((item, index) => (
            <div key={index} className="flex flex-col gap-4">
              {/* AI 대화 (왼쪽) */}
              <div className="flex items-start gap-3">
                <AvatarIcon className="w-16 h-16 rounded-full flex-shrink-0 text-primary" />
                <div className="bg-primary-primary p-4 rounded-[20px]">
                  <p className="text-white">{item.ai}</p>
                </div>
              </div>

              {/* 사용자 대화 (오른쪽) */}
              {item.user && (
                <div className="flex items-start justify-end gap-3">
                  <div className="bg-grayscale-gray80 p-4 rounded-[20px]">
                    <p className="text-white">{item.user}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-6 border-t flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full h-14 bg-grayscale-gray10 text-grayscale-gray-80 font-semibold rounded-lg hover:bg-grayscale-gray-20 transition-colors"
          >
            닫기
          </button>
        </div>
      </motion.div>
    </div>
  );
}
