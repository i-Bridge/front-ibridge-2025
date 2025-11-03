import { Fetcher } from '@/lib/fetcher';
import FamilyTree from '@/app/parent/[childId]/familyedit/_components/FamilyTree';
import EditFamilyName from '@/app/parent/[childId]/familyedit/_components/EditFamilyName';
import ChildrenForm from '@/app/parent/[childId]/familyedit/_components/ChangeChildInfo';
import { ChildPageParams } from '@/types/page-props';
import PageLayout from '../_components/Layout/ParentLayout';
import { Child, Parent } from '@/types';
import { Text } from '@/ui/Text';
import ParentProfileRow from './_components/ParentProfileRow';
import AddChildForm from '@/components/AddChildrenModal';
import CopyLinkButton from './_components/CopyLink';

interface FamilyData {
  familyName: string;
  parents: Parent[];
  children: Child[];
}

export default async function FamilyEditPage() {
  {
    /* error page needed */
  }

  const res = await Fetcher<FamilyData>('/parent/mypage/edit');
  const familyInfo = res.data;
  if (!familyInfo) {
    return <div>로딩 중...</div>;
  }
  console.log(familyInfo);

  const parentCount = familyInfo.parents.length;
  const childCount = familyInfo.children.length;

  return (
    <PageLayout
      title={
        
        <div className='flex '>
          <Text variant={'title01'}>{familyInfo.familyName} </Text>
          <EditFamilyName familyName={familyInfo.familyName} />
        </div>
        

      }
    >
      <div className="flex flex-col w-full">
        <div className="self-stretch  flex flex-col justify-start items-start gap-5">
          {/* 1. 관리자 헤더 */}
          <div className="self-stretch flex flex-col justify-center items-start gap-2">
            <div className="self-stretch inline-flex justify-start items-center gap-2">
              <Text variant={'title04'}>관리자</Text>
              <Text variant={'title04'} className="text-primary-primary">
                {parentCount}
              </Text>
            </div>
            <Text variant={'body04'} className="text-grayscale-gray70">
              관리자는 자녀의 분석 데이터를 조회하고 관리할 수 있어요.
            </Text>
          </div>

          {/* 2. 관리자 프로필 카드 (클라이언트 컴포넌트) */}
          <div className="self-stretch flex flex-col gap-4">
            {/* 1. 이름, 수정 버튼, 이메일이 있는 첫 번째 줄 */}
            <div className="self-stretch p-8 rounded-2xl border border-gray-200 flex flex-col justify-center items-start gap-7">
              <div className="flex flex-col gap-2">
              {familyInfo.parents.map((parent) => (
                <ParentProfileRow
                  key={parent.id} // React 루프에서는 고유한 key가 필수입니다.
                  initialName={parent.name}
                  email={parent.email}
                  isMe={familyInfo.parents[0] === parent} // '나' 여부 전달
                />
              ))}
              </div>
               <CopyLinkButton link="https://ibridge.framer.website/" />
            </div>
          </div>
          {/* 2. 자녀 헤더 */}
        <div className="self-stretch flex flex-col justify-center items-start gap-2">
          <div className="self-stretch inline-flex justify-start items-center gap-2">
            <Text variant={'title04'}>자녀</Text>
            <Text variant={'title04'} className="text-primary-primary">
              {childCount}
            </Text>
          </div>
          <Text variant={'body04'} className="text-grayscale-gray70">
            자녀를 추가하면 해당 자녀의 프로필이 생성됩니다.
          </Text>
        </div>
        </div>
        
      </div>
    </PageLayout>
  );
}
