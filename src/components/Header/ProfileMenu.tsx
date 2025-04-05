'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { handleLogout } from '@/components/Auth/LogoutButton';

const menuVariants = {
  hidden: { opacity: 0, y: -5 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

// 임시 데이터
const dummyMails = [
  { id: 1, type: 1 },
  { id: 2, type: 2, name: '홍길동' },
  { id: 3, type: 1 },
];

const dummyChildren = [
  { id: 'child1', name: '민수' },
  { id: 'child2', name: '지우' },
  { id: 'child3', name: '서연' },
  { id: 'child4', name: '하준' },
];

export default function ProfileMenu({ childId }: { childId: string }) {
  const router = useRouter();

  const handleChildClick = (id: string) => {
    router.push(`/parent/${id}/home`);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={menuVariants}
      className="absolute right-0 mt-2 w-80 p-2 bg-white border rounded-lg shadow-lg"
    >
      {/* 상단 프로필 */}
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
            사용자 이름
          </p>
          <p className="text-xs text-gray-600 leading-tight">
            user@example.com
          </p>
        </div>
      </div>

      <div className="">
        <p className="font-semibold text-sm text-center  mt-3 text-gray-800">
          📬mailbox
        </p>
        <div className="divide-y divide-gray-200 p-2">
          {/* 맨 위 구분선 */}
          {dummyMails.slice(0, 3).map((mail) => (
            <div
              key={mail.id}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center space-x-2">
                <div
                  className={`w-6 h-6 flex items-center justify-center rounded-full ${
                    mail.type === 1
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-pink-100 text-pink-600'
                  }`}
                >
                  {mail.type === 1 ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-5-5.917V4a2 2 0 10-4 0v1.083A6.002 6.002 0 004 11v3.159c0 .538-.214 1.055-.595 1.436L2 17h5m5 0v1a3 3 0 11-6 0v-1m6 0a3 3 0 006 0v-1"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {mail.type === 1
                    ? '아이가 답변을 완료했어요'
                    : `${mail.name}님이 요청을 보냈어요`}
                </span>
              </div>
              {mail.type === 2 && (
                <div className="flex space-x-2 ml-2">
                  <button className="text-xs border border-blue-500 text-blue-600 rounded px-2 py-1 hover:bg-blue-50">
                    수락
                  </button>
                  <button className="text-xs border border-red-500 text-red-500 rounded px-2 py-1 hover:bg-red-50">
                    거절
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 자식 프로필 리스트 */}
      <div className="border-t p-4">
        <div className="grid grid-cols-4 gap-4">
          {dummyChildren.map((child) => (
            <button
              key={child.id}
              onClick={() => handleChildClick(child.id)}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                {child.name}
              </div>
            </button>
          ))}
        </div>
        <p className="font-light text-xs text-gray-400  mt-2">
          {' '}
          원하시는 자녀 페이지를 선택하세요
        </p>
      </div>

      {/* 가족 정보 수정 */}
      <ul className=" border-t">
        <Link href={`/parent/${childId}/familyedit`}>
          <li>
            <button className="block w-full px-4 py-2 text-sm font-semibold text-left hover:bg-gray-100">
              가족 정보 수정하기
            </button>
          </li>
        </Link>
      </ul>

      {/* 나가기 & 로그아웃 */}
      <div className="border-t">
        <button
          onClick={() => alert('나가기')}
          className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-100"
        >
          나가기
        </button>
        <button
          onClick={handleLogout}
          className="block w-full px-4 py-2 text-sm  text-left text-red-600 hover:bg-red-100"
        >
          로그아웃
        </button>
      </div>
    </motion.div>
  );
}
