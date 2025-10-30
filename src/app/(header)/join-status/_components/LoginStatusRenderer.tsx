// 폼 컴포넌트는 상대 경로로 가정합니다.
import FamilyJoinWaitingForm from '@/app/(header)/join-status/_components/FamilyJoinWaitingForm';
import FamilyJoinSuccessForm from '@/app/(header)/join-status/_components/FamilyJoinSuccessForm';
import { Child, Parent } from '@/types';

// status 3은 서버에서 이미 리디렉션되었으므로 1, 2만 처리합니다.
interface LoginResponse {
  familyName: string;
  status: 1 | 2 | 3; 
  children: Child[];
  parents: Parent[];
}

interface FamilyStatusRendererProps {
  data: LoginResponse;
}

/**
 * FamilyStatusRenderer (Client Component)
 * 서버 컴포넌트에서 이미 상태(1, 2)가 분류된 데이터를 받아 렌더링만 전담합니다.
 */
export default function FamilyStatusRenderer({
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
    <div className="text-center text-red-500">
      알 수 없는 가족 합류 상태입니다.
    </div>
  );
}