// 폼 컴포넌트는 상대 경로로 가정합니다.

import FamilyJoinWaitingForm from '@/app/(header)/join-status/_components/FamilyJoinWaitingForm';
import FamilyJoinSuccessForm from '@/app/(header)/join-status/_components/FamilyJoinSuccessForm';
import {LoginData} from '@/types';
import ModalCard from '@/ui/Modal/ModalCard';


interface FamilyStatusRendererProps {
  data: LoginData;
}

/**
 * FamilyStatusRenderer (Client Component)
 * 서버 컴포넌트에서 이미 상태(1, 2)가 분류된 데이터를 받아 렌더링만 전담합니다.
 */
export default function LoginStatusRenderer({
  data,
}: FamilyStatusRendererProps) {
  const { status, familyName, parents } = data;
  
  const parentNames = parents.map((p) => p.name);
 
  if (status === 1) {
    // status: 1 (대기)
   return (
       <FamilyJoinWaitingForm
         familyName={familyName || '가족'}
        parentNames={parentNames}
       />
    );
   }

   if (status === 2) {
     // status: 2 (수락 성공)
     return (
       <FamilyJoinSuccessForm
        familyName={familyName || '가족'}
        parentNames={parentNames}
     />
     );
  }
  
  // 예외 상황 발생 시 (이 코드가 실행될 일은 없어야 함)
  return (
    <ModalCard
      hasBorder={false}
      className="h-[400px] items-center justify-center"
    >
      알 수 없는 LoginStatus 상태입니다.
    </ModalCard>
  );
}
