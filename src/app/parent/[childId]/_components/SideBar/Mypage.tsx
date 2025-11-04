'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '@/components/Headers/LogoutButton';
import { HomeIcon, PrimaryCheckIcon } from '@/ui/icon/icon';
import { Text } from '@/ui/Text';
import { Button } from '@/ui/Button';

type MypageDataProps = {
  childId: string;
  mypageData: MyPageData;
};

interface MyPageData {
  name: string;
  familyName: string;
  children: {
    childId: string;
    childName: string;
  }[];
}

export default function Mypage({ childId, mypageData }: MypageDataProps) {
  const router = useRouter();

  return (
    <div className="self-stretch bg-white rounded-[20px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)] inline-flex flex-col justify-start items-start overflow-hidden z-50">
      <div className="self-stretch flex justify-start items-center gap-2 px-6 py-4 border-b border-grascale-gray10">
        <HomeIcon />
        <Text variant="caption04" className="text-grayscale-gray70">
          {mypageData.familyName}
        </Text>
      </div>

      <div className="">
        {mypageData.children.map((child) => {
          // 현재 "임시 선택된" 아이인지 확인
          const isThisChild = String(child.childId) === childId;

          // ===================== [디버깅 코드 추가] =====================
          // map 루프 안에서 각 값을 비교합니다.
          console.log(
            `비교: child.childId=${child.childId}(${typeof child.childId}) === childId=${childId}(${typeof childId}) => 결과: ${isThisChild}`,
          );
          return (
            <div
              key={child.childId}
              // 피그마 코드: self-stretch px-6 py-3 inline-flex ...
              // 상호작용을 위해 className과 onClick 추가
              className="
                self-stretch px-6 py-3 inline-flex justify-between items-center gap-2.5 w-full
                cursor-pointer transition-colors hover:bg-gray-100"
              onClick={() => router.push(`/parent/${child.childId}/dashboard`)} // 클릭 시 임시 상태만 변경
            >
              {/*
                선택 여부에 따라 텍스트 색상 변경 
              */}
              <Text
                variant="caption03"
                className={` ${
                  isThisChild
                    ? 'text-primary-primary' // true일 때 클래스
                    : 'text-grayscale-gray70' // false일 때 클래스
                }`}
              >
                {child.childName}
              </Text>

              {/*
                선택된 경우에만 체크 아이콘 표시
              */}
              {isThisChild && <PrimaryCheckIcon />}
            </div>
          );
        })}
      </div>

      {/* 나가기 & 로그아웃 */}
      <div className="self-stretch p-3 inline-flex flex-col justify-center items-start gap-2.5">
        <Button
        as={Link}
        
                href={`/child/${childId}/home`}
         
          variant={'primary'}
          textVariant="caption04"
          className=" h-10 px-4 py-2 inline-flex justify-center items-center gap-1"
        >
          자녀 페이지로 이동
        </Button>

        <LogoutButton className=" h-10 px-4 py-2" textVariant="caption04">
          로그아웃
        </LogoutButton>

        {/* 로그아웃 버튼 ui 수정하기 */}
      </div>
    </div>
  );
}
