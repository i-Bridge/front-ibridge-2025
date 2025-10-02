'use client';

import { useState } from 'react';
import { Fetcher } from '@/lib/fetcher';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useSubjectStore } from '@/store/useSubjectStore';
import {
  Type1Notice,
  Type2Notice,
  Type3Notice,
  Type4Notice,
} from './MailTypes';
import emitter from '@/lib/eventBus';
import { useSubjectsInfinite } from '@/hooks/parentHome/useSubjectsInfinite';

interface Notice {
  noticeId: number;
  type: 1 | 2 | 3 | 4;
  senderId: number | null;
  senderName: string | null;
  time: string;
  subject: number;
  accept: boolean;
}

interface NoticeData {
  notices: Notice[];
}

// 🔹Notice data Fetcher
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
  const { setSelectedSubjectId, setShowPanels } = useSubjectStore();
  const { loadNext } = useSubjectsInfinite();
  const MAX_VISIBLE = 3;

  // 🔹 버튼 클릭 시 열리고, 처음 열릴 때만 fetch
  async function handleToggleOpen() {
    const willOpen = !open;
    setOpen(willOpen);

    if (willOpen && !fetched) {
      setLoading(true);
      await fetchNoticeData(setNoticeData, setError, setLoading);
      setFetched(true); // ✅ 이미 호출함 표시
    }
  }

  // 🔹 자식 답변 열람 handle
  async function handleView(
    noticeId: number,
    senderId: number|null,
    subjectId: number,
    time: string,
  ) {
    if (!noticeId || !time) return;

    loadNext(noticeId, subjectId);

    //알람 업데이트, 알림창 닫아짐
    await fetchNoticeData(setNoticeData, setError);
    setOpen(false);

    const currentChildId = Number(params.childId);

    setSelectedSubjectId(subjectId);
    setShowPanels(true);

    if (currentChildId !== senderId) {
      //해당 자식의 답변 열람 화면으로 이동, 자식 바뀌며 readSubject 자동 호출

      router.push(`/redirect/mailToSubject?target=/parent/${senderId}/home`);
    } else {
      //weekly router.refresh()로 readSubject 자동 호출
      emitter.emit('reloadReadData');
    }

    
  }

  // 🔹요청 accept handle
  async function handleAccept(senderId: number | null) {
    if (!senderId) return;

    const res = await Fetcher('/parent/notice/accept', {
      method: 'POST',
      data: { parentId: senderId },
    });

    if (res.isSuccess) {
      await fetchNoticeData(setNoticeData, setError);
    } else {
      console.error('수락 실패:', res.message);
    }
  }

  // 🔹요청 decline handle
  async function handleDecline(senderId: number | null) {
    if (!senderId) return;

    const res = await Fetcher('/parent/notice/decline', {
      method: 'POST',
      data: { parentId: senderId },
    });

    if (res.isSuccess) {
      await fetchNoticeData(setNoticeData, setError);
    } else {
      console.error('거절 실패:', res.message);
    }
  }

  // 🔹 모두 열람 버튼 핸들러
  const handleReadAll = async () => {
    const res = await Fetcher('/parent/notice/readAll', {
      method: 'POST',
    });

    if (res.isSuccess) {
      await fetchNoticeData(setNoticeData, setError, setLoading);
    } else {
      console.error('모두 열람 실패:', res.message);
    }
  };

  const filteredNotices = noticeData?.notices?.filter((mail) => !mail.accept);

  // 🔹 카드 그룹 나누기
  const row1Mails = filteredNotices?.filter((mail) => mail.type !== 1) || [];
  const row2Mails = filteredNotices?.filter((mail) => mail.type === 1) || [];

  // 🔹 MailRow 재사용
  const MailRow = ({
    mails,
    label,
    loading,
    error,
  }: {
    mails: Notice[];
    label?: string;
    loading?: boolean;
    error?: string | null;
  }) => {
    const [startIdx, setStartIdx] = useState(0);

    const handlePrev = () =>
      setStartIdx((prev) => Math.max(prev - MAX_VISIBLE, 0));
    const handleNext = () =>
      setStartIdx((prev) =>
        Math.min(prev + MAX_VISIBLE, mails.length - MAX_VISIBLE),
      );

    const visibleMails = mails.slice(startIdx, startIdx + MAX_VISIBLE);

    return (
      <div className="mb-4">
        {label && (
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-500">{label}</div>
            {label === '답변 열람' && (
              <button
                onClick={handleReadAll}
                disabled={mails.length === 0} // 🔹 메일 없으면 비활성화
                className={`text-xs px-2 py-1 rounded border 
          ${
            mails.length === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
              >
                모두 열람
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 border border-gray-200 rounded-lg ">
          {loading ? (
            <div className=" text-sm text-gray-500 p-6">로딩 중...</div>
          ) : error ? (
            <div className="p-2 text-sm text-red-500">{error}</div>
          ) : mails.length === 0 ? (
            <div className=" text-sm text-gray-500 p-6">
              새로운 알림이 없습니다.
            </div>
          ) : (
            visibleMails.map((mail) => {
              switch (mail.type) {
                case 1:
                  return (
                    <Type1Notice
                      key={mail.noticeId}
                      mail={mail}
                      onView={() =>
                        handleView(
                          mail.noticeId,
                          mail.senderId,
                          mail.subject,
                          mail.time,
                        )
                      }
                    />
                  );
                case 2:
                  return (
                    <Type2Notice
                      key={mail.noticeId}
                      mail={mail}
                      onAccept={() => handleAccept(mail.senderId)}
                      onDecline={() => handleDecline(mail.senderId)}
                    />
                  );
                case 3:
                  return <Type3Notice key={mail.noticeId} mail={mail} />;
                case 4:
                  return <Type4Notice key={mail.noticeId} mail={mail} />;
                default:
                  return null;
              }
            })
          )}
        </div>

        {mails.length > MAX_VISIBLE && (
          <div className="flex justify-center mt-2 gap-2">
            <button
              onClick={handlePrev}
              disabled={startIdx === 0}
              className={`w-8 h-6 flex items-center justify-center rounded-full border  bg-gray-100 hover:bg-gray-200 ${
                startIdx === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-black'
              }`}
            >
              {'<'}
            </button>
            <button
              onClick={handleNext}
              disabled={startIdx >= mails.length - MAX_VISIBLE}
              className={`w-8 h-6 flex items-center justify-center rounded-full border  bg-gray-100 hover:bg-gray-200 ${
                startIdx >= mails.length - MAX_VISIBLE
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-black'
              }`}
            >
              {'>'}
            </button>
          </div>
        )}
      </div>
    );
  };

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
          className="w-10 h-10 p-1 mt-1 transition-colors duration-200 ease-in-out hover:text-orange-600"
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
        <div className="absolute z-49 mt-2 w-96 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-center ">메일함</h3>
            <button
              onClick={() => setOpen(false)}
              className="text-red-700 hover:text-red-900 font-bold"
            >
              X
            </button>
          </div>

          {/* ✅ 로딩/에러 상태를 MailRow로 넘김 */}
          <MailRow
            mails={row1Mails}
            label="알림"
            loading={loading}
            error={error}
          />
          <MailRow
            mails={row2Mails}
            label="답변 열람"
            loading={loading}
            error={error}
          />
        </div>
      )}
    </div>
  );
}
