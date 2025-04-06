'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { ApiResponse } from '@/types';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { handleLogout } from '@/components/Auth/LogoutButton';

interface MyPageData {
  name: string;
  familyName: string;
  children: {
    id: number;
    name: string;
  }[];
}
interface Notice {
  noticeId: number;
  type: 1 | 2 | 3; // 1: 답변 완료, 2: 가족 가입 수락, 3: 서버 점검
  senderId: number | null;
  senderName: string | null;
  isAccept: boolean;
  time: string; // ISO string 타입 (ex: "2025-03-21 18:00:02")
}

interface NoticeData {
  notices: Notice[];
}

export default function MyPage() {
  const [mypageData, setMypageData] = useState<MyPageData | null>(null);
  const [noticeData, setNoticeData] = useState<NoticeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMypage() {
      try {
        const [mypageRes, noticeRes] = await Promise.all([
          axiosInstance.get<ApiResponse<MyPageData, { isSuccess: boolean }>>('/parent/mypage'),
          axiosInstance.get<ApiResponse<NoticeData, { isSuccess: boolean }>>('/parent/notice'), // ✨ 새로운 API
        ]);

        if (mypageRes.data.code !== '200') {
          console.error('마이페이지 API 응답 실패:', mypageRes.data.message);
          setError(`마이페이지 서버 오류: ${mypageRes.data.message}`);
          return;
        }
        
        if (noticeRes.data.code !== '200') {
          console.error('공지사항 API 응답 실패:', noticeRes.data.message);
          setError(`공지사항 서버 오류: ${noticeRes.data.message}`);
          return;
        }
        
        if (!mypageRes.data.isSuccess) {
          console.log('마이페이지 API isSuccess: false');
          setError('마이페이지 데이터 로드 실패');
          return;
        }
        
        if (!noticeRes.data.isSuccess) {
          console.log('공지사항 API isSuccess: false');
          setError('공지사항 데이터 로드 실패');
          return;
        }
        
        setMypageData(mypageRes.data.data);
        setNoticeData(noticeRes.data.data);


      } catch (err) {
        console.error('요청 중 오류 발생:', err);
        setError('요청 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }

    fetchMypage();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!mypageData) {
    return <div>데이터 없음</div>;
  }

  const menuVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
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
  <p className="font-semibold text-sm text-center mt-3 text-gray-800">
    📬 mailbox
  </p>
  <div className="max-h-60 overflow-y-auto divide-y divide-gray-200 p-2">
    {/* 스크롤 가능한 영역 */}
    {noticeData?.notices
      ?.filter((mail) => !mail.isAccept) // 수락된 거 빼고
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()) // 최신순 정렬
      .slice(0, 10) // 일단 10개까지 보여줌 (스크롤로 보게)
      .map((mail) => (
        <div
          key={mail.noticeId}
          className="flex items-center justify-between py-3"
        >
          <div className="flex items-center space-x-2">
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-full ${
                mail.type === 1
                  ? 'bg-blue-100 text-blue-600'
                  : mail.type === 2
                  ? 'bg-pink-100 text-pink-600'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {mail.type === 1 ? (
                // 답변 완료 아이콘
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
              ) : mail.type === 2 ? (
                // 가족 가입 수락 아이콘
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
              ) : (
                // 서버 점검 아이콘
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
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M12 20h.01M4.93 4.93l1.414 1.414M1 12h2m15.657-7.071l1.414 1.414M20 12h2m-2 0a8 8 0 11-16 0 8 8 0 0116 0z"
                  />
                </svg>
              )}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {mail.type === 1
                ? '아이가 답변을 완료했어요'
                : mail.type === 2
                ? `${mail.senderName ?? '누군가'}님이 가족 가입을 요청했어요`
                : '서버 점검 공지'}
            </span>
          </div>

          {/* 가족 가입 요청일 때만 수락/거절 버튼 표시 */}
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
          {mypageData.children.map((child) => (
            <Link
              key={child.id}
              href={`/parent/${child.id}/home`}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                {child.name}
              </div>
            </Link>
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
        <Link
          href="/profile" 
          className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-100"
        >
          나가기
        </Link>

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
