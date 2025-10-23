'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

// API 응답 데이터 타입 (page.tsx에서 전달받을 타입)
type QuestionItem = {
  ai: string;
  user: string | null;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  history: QuestionItem[];
};

// 아이콘 경로 (프로젝트에 맞게 수정 필요)
const AI_ICON_PATH = '/images/talking-owlly.webp';
const USER_ICON_PATH = '/images/user-avatar.png'; // 사용자(아이) 아바타 이미지 경로

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
        onClick={(e) => e.stopPropagation()} // 모달 클릭 시 닫히지 않도록 이벤트 전파 차단
      >
        {/* 헤더 */}
        <h3 className="text-xl font-bold text-gray-800 text-center py-5 flex-shrink-0 border-b">
          이전 대화 기록
        </h3>

        {/* 대화 내용 (스크롤) */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {history.map((item, index) => (
            <div key={index} className="flex flex-col gap-4">
              {/* AI 대화 (왼쪽) */}
              <div className="flex items-start gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={AI_ICON_PATH}
                    alt="AI"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="bg-gray-100 p-4 rounded-lg rounded-tl-none">
                  <p className="text-gray-800">{item.ai}</p>
                </div>
              </div>

              {/* 사용자 대화 (오른쪽) */}
              {item.user && (
                <div className="flex items-start justify-end gap-3">
                  <div className="bg-blue-100 p-4 rounded-lg rounded-tr-none">
                    <p className="text-gray-800">{item.user}</p>
                  </div>
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={USER_ICON_PATH}
                      alt="User"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 닫기 버튼 */}
        <div className="p-6 border-t flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full h-14 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            닫기
          </button>
        </div>
      </motion.div>
    </div>
  );
}
