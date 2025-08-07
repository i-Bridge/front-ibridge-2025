'use client';

import { useState } from 'react';
import { Fetcher } from '@/lib/fetcher';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useSubjectStore } from '@/store/useSubjectStore';

interface Notice {
  noticeId: number;
  type: 1 | 2 | 3;
  senderId: number | null;
  senderName: string | null;
  time: string;
  subject: number;
  accept: boolean;
}

interface NoticeData {
  notices: Notice[];
}

// ✅ 공통 fetch 함수로 분리
async function fetchNoticeData(
  setNoticeData: (data: NoticeData | null) => void,
  setError: (msg: string | null) => void,
  setLoading?: (loading: boolean) => void,
) {
  try {
    const res = await Fetcher<NoticeData>('/parent/notice');
    if (res && res.data) {
      setNoticeData(res.data);
    } else {
      setNoticeData(null);
    }
    console.log('💓 NoticeData:', res); //추후 삭제 예정
  } catch (err) {
    console.error('요청 중 오류 발생:', err);
    setError('⚠️ 알림을 불러오는 중 오류가 발생했습니다.');
  } finally {
    if (setLoading) setLoading(false);
  }
}

export default function MailBox() {
  const router = useRouter();
  const params = useParams();
  const [noticeData, setNoticeData] = useState<NoticeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false); // 드롭다운 상태
  const [fetched, setFetched] = useState(false); // 버튼 이벤트 계속 발생해도 처음 한 번만 호출하게
  const { setSelectedSubjectId,  setShowPanels } = useSubjectStore();

  

  // ✅ 버튼 클릭 시 열리고, 처음 열릴 때만 fetch
  async function handleToggleOpen() {
    const willOpen = !open;
    setOpen(willOpen);

    if (willOpen && !fetched) {
      setLoading(true);
      await fetchNoticeData(setNoticeData, setError, setLoading);
      setFetched(true); // ✅ 이미 호출함 표시
    }
  }

  async function handleView(
    noticeId: number | null,
    senderId: number | null,
    subject: number | null,
  ) {
    //오류 처리 제대로 필요 
    if (!noticeId) return;
    const currentChildId = Number(params.childId);

    router.refresh();

    if(currentChildId!==senderId){
      //해당 자식의 답변 열람 화면으로 이동
       router.push(`/redirect/mailToSubect?target=/parent/${senderId}/home`);
    }
    
    setSelectedSubjectId(subject);
    setShowPanels(true);
  }

  async function handleAccept(senderId: number | null) {
    if (!senderId) return;

    const res = await Fetcher('/parent/notice/accept', {
      method: 'POST',
      data: { parentId: senderId },
    });

    if (res.isSuccess) {
      console.log('수락 성공:', res.message);
      router.refresh();
      await fetchNoticeData(setNoticeData, setError); // ✅ 다시 불러오기
    } else {
      console.error('수락 실패:', res.message);
    }
  }

  async function handleDecline(senderId: number | null) {
    if (!senderId) return;

    console.log('거절하는 parentId:', senderId);

    const res = await Fetcher('/parent/notice/decline', {
      method: 'POST',
      data: { parentId: senderId },
    });

    if (res.isSuccess) {
      await fetchNoticeData(setNoticeData, setError); // ✅ 다시 불러오기
      router.refresh();
    } else {
      console.error('거절 실패:', res.message);
    }
  }

  return (
    <div className="relative inline-block text-left">
      {/* 드롭다운 버튼 */}
      <button onClick={handleToggleOpen} className="flex items-center gap-2 ">
        {/* SVG 아이콘을 직접 넣은 부분 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-10 h-10  p-1 mt-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z"
          />
        </svg>
      </button>

      {/* 드롭다운 내용 */}
      {open && (
        <div className="absolute z-[-1] mt-2 w-96 right-0 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto divide-y">
          {loading ? (
            <div className="p-4 text-sm text-gray-500">로딩 중...</div>
          ) : error ? (
            <div className="p-4 text-sm text-red-500">{error}</div>
          ) : noticeData?.notices?.filter((mail) => !mail.accept).length ===
            0 ? (
            <div className="p-4 text-sm text-gray-500">
              새로운 알림이 없습니다.
            </div>
          ) : (
            noticeData?.notices
              .filter((mail) => !mail.accept)
              .sort((a, b) => b.noticeId - a.noticeId)
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
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
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
                        ? `${mail.senderName ?? '자녀'}(이)가 답변을 완료했어요`
                        : mail.type === 2
                          ? `${mail.senderName ?? '누군가'}님이 가족 가입을 요청했어요`
                          : '서버 점검 공지'}
                    </span>
                    <span className="text-sm text-gray-300">
                     {mail.type === 1 && mail.time}
                    </span>
                  </div>

                  {mail.type === 1 && (
                    <div className="flex space-x-2 ml-2">
                      <button
                        onClick={() =>
                          handleView(mail.noticeId, mail.senderId, mail.subject)
                        }
                        className="text-xs border border-green-500 text-green-600 rounded px-2 py-1 hover:bg-blue-50"
                      >
                        답변 열람
                      </button>
                    </div>
                  )}

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
