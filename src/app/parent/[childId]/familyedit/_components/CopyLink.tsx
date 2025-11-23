'use client';

import { Button } from '@/ui/Button';
import { PlusIcon } from '@/ui/icon/icon';
import { showCustom, showError } from '@/lib/toast';

/**
 * 토스트 메시지에 띄울 체크 아이콘
 * (필요에 따라 별도 파일로 분리하거나 기존 아이콘을 사용하셔도 됩니다)
 */
function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#16A34A" // green-600
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function CopyLinkButton({ link }: { link: string }) {
  const handleCopy = async () => {
    try {
      // 1. 클립보드 복사
      await navigator.clipboard.writeText(link);

      showCustom({
        icon: <CheckIcon />, // 복사 성공을 알리는 체크 아이콘
        message: '링크가 복사되었습니다',
      });
      
    } catch (err) {
      console.error('복사 실패:', err);
      showError('링크 복사에 실패했습니다.');
    }
  };

  return (
    <div className="">
      {/* 버튼 클릭 시 handleCopy 실행 */}
      <Button
        onClick={handleCopy}
        variant="grayscale"
        textVariant="caption03"
        textClass="text-grayscale-gray60 flex gap-2"
        className="w-full bg-grayscale-gray5 h-14 p-8 inline-flex justify-center items-center gap-2"
      >
        <PlusIcon />
        <div className="flex justify-start items-center gap-2">초대하기</div>
      </Button>
    </div>
  );
}