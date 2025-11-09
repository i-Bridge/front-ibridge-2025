'use client';

import {Button} from '@/ui/Button';
import {Text} from '@/ui/Text';

interface SubjectPopupProps {
  keyword: string;
  onClose: () => void;
}

/**
 * 'N개의 대화' 클릭 시 보일 팝업
 */
export default function SubjectPopup({ keyword, onClose }: SubjectPopupProps) {
  return (
    // 전체 화면 오버레이
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
      onClick={onClose} // 배경 클릭 시 닫기
    >
      {/* 팝업 컨텐츠 */}
      <div
        className="bg-white p-8 rounded-[20px] z-50 w-[90%] max-w-[400px]"
        onClick={(e) => e.stopPropagation()} // 팝업 내부 클릭 시 닫히지 않게
      >
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <Text
            className="text-grayscale-gray90"
          >
            {keyword}
          </Text>
          <Button
            onClick={onClose}
            variant="grayscale" // Button 컴포넌트에 ghost나 icon variant가 있다고 가정
            className="text-grayscale-gray50 text-3xl font-light leading-none hover:text-grayscale-gray90 p-0"
          >
            &times;
          </Button>
        </div>
        {/* 본문 (Placeholder) */}
        <div className="h-48 overflow-y-auto">
          <Text color="gray80" as="div">
            {keyword}
            <br />
            (컴포넌트 구현 필요)
          </Text>
        </div>
      </div>
    </div>
  );
}