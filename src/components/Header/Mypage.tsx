import Link from 'next/link';
import LogoutButton from '@/components/Auth/LogoutButton';

type MypageDataProps = {
  childId: string;
  mypageData: MyPageData;
  userName: string;
  userEmail: string;
};

interface MyPageData {
  name: string;
  familyName: string;
  children: {
    childId: string;
    childName: string;
  }[];
}

export default function Mypage({
  childId,
  mypageData,
  userName,
  userEmail,
}: MypageDataProps) {
  return (
    <div>
      <div className="flex items-center p-4 border-b ">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </div>

        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900 leading-tight">
            {userName}
          </p>
          <p className="text-xs text-gray-600 leading-tight">{userEmail}</p>
        </div>
      </div>

      {/* 자식 프로필 리스트 */}
      {/* 현재 위치한 페이지의 자식 표시되게 */}
      <div className="border-t p-4">
        <div className="grid grid-cols-4 gap-4">
          {mypageData.children.map(
            (child: { childId: string; childName: string }) => {
              const isSelected = String(child.childId) === childId;

              return (
                <Link
                  key={child.childId}
                  href={`/parent/${child.childId}/home`}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-sm font-medium ${
                      isSelected
                        ? 'bg-i-lightorange text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {child.childName}
                  </div>
                </Link>
              );
            },
          )}
        </div>
        <p className="font-light text-xs text-gray-400 mt-2">
          원하시는 자녀 페이지를 선택하세요
        </p>
      </div>

      {/* 가족 정보 수정 */}
      <ul className=" border-t">
        <Link href={`/parent/${childId}/familyedit`}>
          <li>
            <button className="block w-full px-4 py-2 text-sm  text-left hover:bg-gray-100">
              가족 정보 수정하기
            </button>
          </li>
        </Link>
      </ul>

      {/* 나가기 & 로그아웃 */}
      <div className="border-t">
        <Link
          href="/profile"
          className="block w-full px-4 py-2 text-sm text-left text-red-500 hover:bg-gray-100"
        >
          나가기
        </Link>

        <LogoutButton className="block w-full px-4 py-2 text-sm text-left text-gray-900 hover:bg-gray-100">
          로그아웃
        </LogoutButton>

        {/* 로그아웃 버튼 ui 수정하기 */}
      </div>
    </div>
  );
}
