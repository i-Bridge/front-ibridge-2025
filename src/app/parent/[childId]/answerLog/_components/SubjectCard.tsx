// app/ui/SubjectCard.tsx
'use client';

import { forwardRef } from 'react';
import { Subject } from '@/types/index';
import { RightArrow } from '../../../../../ui/icon/icon';
import Image from 'next/image';
import { Text } from '../../../../../ui/Text';
type SubjectCardProps = {
  subject: Subject;
  isSelected: boolean;
  onClick: () => void;
};

const SubjectCard = forwardRef<HTMLDivElement, SubjectCardProps>(
  ({ subject, isSelected, onClick }, ref) => {
    return (
      <div
        ref={ref}
        onClick={subject.answer ? onClick : undefined}
        // [수정] 'mb-8' 클래스 제거
        className="self-stretch inline-flex flex-col justify-start items-start gap-3"
      >
        <div
          className={`
            self-stretch  px-7 py-6 rounded-[20px] border border-1
            border-grayscale-gray20
            inline-flex justify-start items-center gap-4
            transition-all w-full
            ${
              isSelected
                ? 'bg-secondary-secondaryLight border-secondary-secondary cursor-pointer' // 선택됨
                : 'bg-white hover:bg-grayscale-gray5 hover: cursor-pointer' // 기본
            }
          `}
        >
          {/* 1. 이미지 컨테이너 */}
          {subject.image && (
            <div className="w-14 h-14 bg-white rounded-full inline-flex flex-col justify-center items-center gap-[1.56px] overflow-hidden flex-shrink-0">
              <Image
                className="w-full h-full object-cover"
                src={subject.image}
                alt={subject.subjectTitle}
                width={56}
                height={56}
              />
            </div>
          )}

          {/* 2. 텍스트 컨테이너 */}
          <div className="flex-1 inline-flex flex-col justify-center items-start gap-1  whitespace-normal">
            <Text variant={'body04'} className="">
              {subject.subjectTitle}
            </Text>
          </div>

          {/* 3. 아이콘 컨테이너 */}
          <div className="w-6 h-6 flex justify-center items-center gap-2.5 stroke-grayscale-gray50">
            <RightArrow />
          </div>
        </div>
      </div>
    );
  },
);

SubjectCard.displayName = 'SubjectCard';

export default SubjectCard;
