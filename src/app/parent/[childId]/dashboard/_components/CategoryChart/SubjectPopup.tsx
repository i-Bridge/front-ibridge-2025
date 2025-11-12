'use client';

import { Button } from '@/ui/Button';
import CommonModalPopup from '@/ui/Modal/CommonModalPopup';
import SubjectListRenderer from '../../../answerLog/_components/SubjectListRenderer';
import { Subject } from '@/types/index';
import AnalysisList from '../../../_components/Question/AnalysisList';
// [1] store와 useEffect를 import (showPanels 관리를 위해 필요)
import { useSubjectStore } from '@/store/useSubjectStore';
import { useEffect } from 'react';

interface SubjectPopupProps {
  category: string;
  positiveScore: number;
  onClose: () => void;
  subjects: Subject[];
}

/**
 * 'N개의 대화' 클릭 시 보일 팝업
 */
export default function SubjectPopup({
  category,
  positiveScore,
  onClose,
  subjects,
}: SubjectPopupProps) {
  // [2] store에서 AnalysisList를 제어하기 위한 상태와
  //     showPanels를 설정할 setter를 가져옵니다.
  const { selectedSubjectId, showPanels, setShowPanels } = useSubjectStore();

  // [3] SubjectListRenderer가 ID를 변경하는 것을 감지하여
  //     AnalysisList를 보여주는 'showPanels' 상태를 동기화합니다.
  useEffect(() => {
    if (selectedSubjectId) {
      setShowPanels(true);
    } else {
      setShowPanels(false);
    }
  }, [selectedSubjectId, setShowPanels]);

  // isEmpty일 때 오류 처리
  const isEmpty = subjects.length === 0;

  return (
    <CommonModalPopup
      title={category}
      
      // [✨ 핵심 수정]
      // 'w-full', 'flex', 'self-stretch', 'items-center', 'justify-start' 등
      // 레이아웃을 깨뜨리는 모든 클래스를 제거합니다.
      // PopupOverlay가 'w-[960px]' 카드 자체를 중앙 정렬할 것입니다.
      modalCardClassName="w-[960px]"
      
      subtitle={`긍정 ${positiveScore}%의 카테고리`}
      footerContent={
        <Button variant={'grayscale'} onClick={onClose} className='w-full '>
          닫기
        </Button>
      }
    >
      {/* 팝업 컨텐츠 */}
      {/* [이전과 동일]
        h-[60vh] (또는 h-[70vh])와 flex로 레이아웃을 잡습니다.
        ModalCard(flex-col)의 자식인 이 div는 이제 
        items-center가 없으므로 960px 너비를 꽉 채웁니다.
      */}
      <div
        className="flex h-[60vh] overflow-hidden p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 왼쪽 패널 (SubjectList) */}
        <div className="flex-1 h-full overflow-y-auto gap-4 pr-4">
          <SubjectListRenderer
            subjects={subjects}
            isLoading={false}
            isEmpty={isEmpty}
            lastItemRef={undefined} // 팝업 내에서는 무한 스크롤 X
          />
        </div>

        {/* 오른쪽 패널 (AnalysisList) - 이 로직은 동일 */}
        {showPanels && selectedSubjectId && (
          <div
            className="h-full overflow-y-auto ml-10 flex-grow flex-1 items-stretch animate-slide-in-right
              transition-transform duration-300 ease-in-out"
          >
            <AnalysisList />
          </div>
        )}
      </div>
    </CommonModalPopup>
  );
}