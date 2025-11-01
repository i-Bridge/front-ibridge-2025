'use client'; 

import Link from 'next/link';
import { ChildCard } from '@/components/ChildCard';
import { Child } from '@/types'; 

interface ChildProfileLinkProps {
  child: Child; 
}

export default function ChildProfileLink({ child }: ChildProfileLinkProps) {
  return (
        <Link
          href={`/child/${child.id}/home`}
          className="block " // Link가 <a> 태그이므로, 카드 전체 클릭을 위해 block으로 설정
        >
          <ChildCard
            child={child}
            showActions={false}
            cardClassName="w-full hover:scale-[1.01]"
          />
        </Link>
  );
}
