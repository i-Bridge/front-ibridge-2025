'use client';

import Link from 'next/link';
import ModalCard from '@/ui/Modal/ModalCard';
import { Text } from '@/ui/Text';
import { Button } from '@/ui/Button';
import CustomCard from '@/ui/CustomCard';
import { AbledCheckCircleIcon } from '@/ui/icon/icon'; // 아이콘 경로가 constants로 가정
import { Parent } from '@/types';

// 1. props 인터페이스 수정: 불필요한 props(onCancelSuccess, loading) 제거
interface FamilyJoinSuccessProps {
  familyName: string;
  parents: Parent[]; // 부모 이름 목록
}

/**
 * 가족 합류 성공 (Status 2) 시 렌더링되는 폼
 * @param familyName - 합류한 가족 이름
 * @param parents - 가족 관리자 이름 목록
 */
export default function FamilyJoinSuccessForm({
  familyName,
  parents,
}: FamilyJoinSuccessProps) {
  const displayName = familyName || '요청한 가족';


  // 2. 'parentNames' 배열을 "이름1님, 이름2님" 형태의 문자열로 변환
  const adminNames =
    parents && parents.length > 0
      ? parents.map((parent) => `${parent.name}님`).join(', ')
      : `${displayName}님`; // 부모 정보가 없을 경우 familyName으로 대체

  return (
    // <ModalCard> 컴포넌트 자체가 컨테이너 역할을 하도록 수정
    <ModalCard
      hasBorder={false}
      className="flex flex-col gap-10 text-center items-center "
    >
      <div className="flex flex-col gap-7 text-center items-center">
        <AbledCheckCircleIcon />

        <div className="flex flex-col gap-3">
          <Text as="div" variant="title01">
            집 승인 요청이
            <br />
            수락되었어요.
          </Text>
          <Text as="div" variant="body03" className="text-grayscale-gray60">
            이제 서비스를 이용할 수 있어요.
          </Text>
        </div>
      </div>

      {/* 합류한 가족 정보 카드 */}
      <CustomCard className="bg-grayscale-gray5 ">
        <div className="flex flex-col justify-start items-start gap-2">
          <Text as="div" variant="title02">
            {displayName}
          </Text>
          {/* 3. '관리자:' 부분에 'adminNames' 변수 사용 */}
          <Text as="div" variant="body03" className="text-grayscale-gray60">
            관리자: {adminNames}
          </Text>
        </div>
      </CustomCard>

      <Button as={Link} href="/profile" variant="primary" className='w-full h-16'>
        서비스 이용하기
      </Button>
    </ModalCard>
  );
}
