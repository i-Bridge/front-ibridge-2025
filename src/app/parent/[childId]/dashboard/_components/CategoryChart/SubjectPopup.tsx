'use client';

import { Button } from '@/ui/Button';
import SubjectListRenderer from '../../../answerLog/_components/SubjectListRenderer';
import AnalysisPopup from '../../../_components/Question/AnalysisListPopup';
import { Subject } from '@/types/index';
import { useSubjectStore } from '@/store/useSubjectStore';
import { useEffect } from 'react';
import PopupOverlay from '@/ui/Modal/PopupOverlay';
import TitleComponent from '@/ui/Modal/TitleComponent';
import ModalHeader from '@/ui/Modal/ModalHeader';
import ModalFooter from '@/ui/Modal/ModalFooter';
import { Suspense } from 'react';
import RotatingSpinner from '@/ui/loading/RotatingSpinner';
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
  const { selectedSubjectId, showPanels, setShowPanels, setSelectedSubjectId } =
    useSubjectStore();

  // Subject ID 변경을 감지하여 'AnalysisList'의 표시 여부를 설정합니다.
  useEffect(() => {
    if (selectedSubjectId) {
      setShowPanels(true);
    } else {
      setShowPanels(false);
    }
  }, [selectedSubjectId, setShowPanels]);


  // x 버튼 클릭 시 selectedSubjectId를 null로 설정하여 팝업을 닫습니다.
  const handleClose = () => {
    setSelectedSubjectId(null);
    onClose();
  };

  return (
    <PopupOverlay onClose={handleClose}>
      <div className="px-10">
        <div className="bg-white flex flex-col justify-start items-start rounded-[40px] relative gap-10 lg:max-w-7xl w-full max-h-[90vh] overflow-hidden">
          {/* 모달 헤더 */}
          <ModalHeader className="pb-0">
            <TitleComponent
              title={category}
              subtitle={`긍정 ${positiveScore}%의 카테고리`}
              align="center"
            />
          </ModalHeader>

          {/* 팝업 컨텐츠 */}
          <div
            className="flex flex-col h-[60vh] overflow-hidden p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 왼쪽 패널 (SubjectList) 및 오른쪽 패널 (AnalysisList) - lg 이상에서 flex-row로 설정 */}
            <div className="flex-1 w-full h-full overflow-hidden gap-4 lg:flex lg:flex-row">
              {/* 왼쪽 패널 (SubjectList) */}
              <div className="flex-1 h-full overflow-y-auto pr-4">
                <SubjectListRenderer
                  subjects={subjects}
                  isLoading={false}
                />
              </div>

              {/* 오른쪽 패널 (AnalysisList) - lg에서만 나란히 표시 */}
              {showPanels && selectedSubjectId && (
                <Suspense
              fallback={
                <RotatingSpinner variant='grayscale'/>
              }
            >
                <AnalysisPopup onClose={handleClose} />
                </Suspense>
              )}
            </div>

            {/* 팝업 하단의 닫기 버튼은 항상 가운데에 위치 */}
            <ModalFooter>
              <Button
                variant={'grayscale'}
                onClick={handleClose}
                className="w-full"
              >
                닫기
              </Button>
            </ModalFooter>
          </div>
        </div>
      </div>
    </PopupOverlay>
  );
}
