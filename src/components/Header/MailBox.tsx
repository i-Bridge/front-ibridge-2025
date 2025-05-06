'use client';

import { useEffect, useState } from 'react';
import { Fetcher } from '@/lib/fetcher';
import { useRouter } from 'next/navigation';

interface Notice {
  noticeId: number;
  type: 1 | 2 | 3;
  senderId: number | null;
  senderName: string | null;
  isAccept: boolean;
  time: string;
}

interface NoticeData {
  notices: Notice[];
}

export default function MailBox() {
  const router = useRouter();
  const [noticeData, setNoticeData] = useState<NoticeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false); // 드롭다운 상태

  async function handleAccept(senderId: number | null) {
    if (!senderId) return;

    try {
      const res = await Fetcher('/parent/notice/accept', {
        method: 'POST',
        data: { parentId: senderId },
      });
      if (res.isSuccess) {
        router.refresh();
      } else {
        console.error('수락 실패:', res.message);
      }
    } catch (err) {
      console.error('수락 요청 중 오류 발생:', err);
    }
  }

  async function handleDecline(senderId: number | null) {
    if (!senderId) return; // senderId 없으면 요청 안 보냄

    try {
      console.log('거절하는 parentId:', senderId);
      const res = await Fetcher('/parent/notice/decline', {
        method: 'POST',
        data: { parentId: senderId }, // ✅ 이렇게 보내야 함
      });
      console.log('거절 요청 응답:', res); // 응답 확인

      if (res.isSuccess) {
        // 성공했으면 다시 새로고침하거나 notice 다시 불러오기
        router.refresh(); // ✅ 간단하게 이걸로 새로고침
      } else {
        console.error('거절 실패:', res.message);
      }
    } catch (err) {
      console.error('거절 요청 중 오류 발생:', err);
    }
  }

  useEffect(() => {
    async function fetchNotice() {
      try {
        const res = await Fetcher<NoticeData>('/parent/notice');
        if (res && res.data) {
          setNoticeData(res.data);
        } else {
          setNoticeData(null);
        }
        console.log('💓받아온 NoticeData:', res);
      } catch (err) {
        console.error('요청 중 오류 발생:', err);
        setError('요청 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }

    fetchNotice();
  }, []);

  return (
    <div className="relative inline-block text-left">
      {/* 드롭다운 버튼 */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2"
      >
        <span className="text-xl">📬</span>
      </button>

      {/* 드롭다운 내용 */}
      {open && (
        <div className="absolute z-10 mt-2 w-96 right-0 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto divide-y">
          {loading ? (
            <div className="p-4 text-sm text-gray-500">로딩 중...</div>
          ) : error ? (
            <div className="p-4 text-sm text-red-500">{error}</div>
          ) : noticeData?.notices?.filter((mail) => !mail.isAccept).length === 0 ? (
            <div className="p-4 text-sm text-gray-500">새로운 알림이 없습니다.</div>
          ) : (
            noticeData?.notices
              .filter((mail) => !mail.isAccept)
              .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
              .slice(0, 10)
              .map((mail) => (
                <div
                  key={mail.noticeId}
                  className="flex items-center justify-between py-3 px-4"
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : mail.type === 2 ? (
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
                    <span className="text-sm text-gray-700">
                      {mail.type === 1
                        ? '아이가 답변을 완료했어요'
                        : mail.type === 2
                        ? `${mail.senderName ?? '누군가'}님이 가족 가입을 요청했어요`
                        : '서버 점검 공지'}
                    </span>
                  </div>

                  {mail.type === 2 && (
                    <div className="flex space-x-2 ml-2">
                      <button
                        onClick={() => handleAccept(mail.senderId)}
                        className="text-xs border border-blue-500 text-blue-600 rounded px-2 py-1 hover:bg-blue-50"
                      >
                        수락
                      </button>
                      <button
                  onClick={() => handleDecline(mail.senderId)}
                  className="text-xs border border-red-500 text-red-500 rounded px-2 py-1 hover:bg-red-50"
                >
                  거절
                </button>
                    </div>
                  )}
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
}
