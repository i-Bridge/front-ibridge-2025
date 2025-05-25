'use client';

import { Tree, TreeNode } from 'react-organizational-chart';
import Image from 'next/image';
import CopyLinkButton from '@/components/Familyedit/copyLink';

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

export default function FamilyTree({ familyData }: { familyData: FamilyData }) {
  const ParentsCard = ({ parents }: { parents: ParentInfo[] }) => {
    return (
      <div className="flex justify-center gap-6 flex-wrap items-center w-auto bg-white p-4 rounded-lg shadow-md border">
        {parents.map((parent) => (
          <div key={parent.parentId} className="flex flex-col items-center">
            <Image
              src={parent.parentGender === 0 ? '/images/boy.svg' : '/images/girl.svg'}
              alt={parent.parentName}
              width={50}
              height={50}
              className="rounded-full"
            />
            <p className="text-sm font-semibold">{parent.parentName}</p>
          </div>
        ))}
      </div>
    );
  };

  const ChildCard = ({ name, image }: { name: string; image: string }) => (
    <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-md border">
      <Image
        src={image}
        alt={name}
        width={50}
        height={50}
        className="rounded-full"
      />
      <p className="text-sm font-semibold mt-2">{name}</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      <Tree
        lineWidth={'2px'}
        lineColor={'#034892'}
        lineBorderRadius={'10px'}
        label={
         <div className="relative">
          {/* 부모 카드 */}
          <ParentsCard parents={familyData.parents} />
          
          {/* 오른쪽에 위치한 작은 컴포넌트 */}
          <div className="absolute right-[-60px] top-1/2 transform -translate-y-1/2">
            {/* 여기에 원하는 작은 컴포넌트 추가 */}
            <CopyLinkButton link="https://example.com/invite/abc123" />
          </div>
        </div>
        }
      >
        {familyData.children.map((child) => (
          <TreeNode
            key={child.childId}
            label={
              <ChildCard
                name={child.childName}
                image={child.childGender === 0 ? '/images/boy.svg' : '/images/girl.svg'}
              />
            }
          />
        ))}
      </Tree>
    </div>
  );
}
