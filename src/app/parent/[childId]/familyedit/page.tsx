import { Fetcher } from '@/lib/fetcher';
import EditPageHeader from '@/components/Familyedit/EditHeader';
import FamilyTree from '@/components/Familyedit/familyTree';
import FamilyName from '@/components/Familyedit/editFamilyName';
import ChildrenForm from '@/components/Familyedit/changeChildInfo';
import { ChildPageParams } from '@/types/page-props';


interface ParentInfo {
  parentId: number;
  parentName: string;
  parentGender: 0 | 1; // 0: 남성, 1: 여성
}

interface ChildInfo {
  childId: number;
  childName: string;
  childGender: 0 | 1;
}

interface FamilyData {
  familyName: string;
  parents: ParentInfo[];
  children: ChildInfo[];
}

export default async function ChildrenSettingsPage({
  params,
}: ChildPageParams) {
  // params가 Promise이므로, await를 사용해 값을 추출
  const { childId } = await params;
  {
    /* error page needed */
  }

  const res = await Fetcher<FamilyData>('/parent/mypage/edit');
  const familyInfo = res.data;
  if (!familyInfo) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen ">
      <EditPageHeader childId={childId} />
      <div className="flex flex-col items-center py-10 w-full bg-red-100">
        <FamilyName familyName={familyInfo.familyName} />
        <FamilyTree familyData={familyInfo} />
      </div>
      <p className="text-2xl font-semibold py-10 ">자녀 정보 수정하기</p>
      <ChildrenForm />
    </div>
  );
}
