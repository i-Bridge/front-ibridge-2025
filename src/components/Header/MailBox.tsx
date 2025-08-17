'use client';

import { useState } from 'react';
import { Fetcher } from '@/lib/fetcher';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useSubjectStore } from '@/store/useSubjectStore';
import { useDateStore } from '@/store/useDateStore';
import emitter from '@/lib/eventBus';

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

// 🔹 알림 전송된 시각
function formatDateKST(dateStr: string) {
  // "2025-08-12 00:00:00.0" → "2025-08-12 00:00"
  const trimmed = dateStr.split(':').slice(0, 2).join(':');

  const datePart = trimmed.split(' ')[0]; // "2025-08-12"
  const timePart = trimmed.split(' ')[1]; // "00:00"

  // KST(UTC+9)로 변환
  const target = new Date(`${datePart}T${timePart}:00+09:00`);
  const now = new Date();

  // 오늘 날짜(한국 기준)로 맞춰서 계산
  const kstNow = new Date(
    now.getTime() + (9 * 60 - now.getTimezoneOffset()) * 60 * 1000,
  );
  const kstTarget = new Date(target.getTime());

  // 0시 기준으로 맞추기
  kstNow.setHours(0, 0, 0, 0);
  kstTarget.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (kstNow.getTime() - kstTarget.getTime()) / (1000 * 60 * 60 * 24),
  );

  let dayText;
  if (diffDays === 0) {
    dayText = '오늘';
  } else {
    dayText = `${diffDays}일 전`;
  }

  // 시간 변환
  const [hour, minute] = timePart.split(':');
  const timeText = `${hour}: ${minute}`;

  return (
    <div className="text-right text-xs text-gray-300">
      {dayText}
      <br />
      {timeText}
    </div>
  );
}

// 🔹 type === 1 (답변 완료)
export function Type1Notice({
  mail,
  onView,
}: {
  mail: Notice;
  onView: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 px-4 h-16">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
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
        </div>
        <span className="text-sm text-gray-700">
          {mail.senderName ?? '자녀'}(이)가 답변을 완료했어요
        </span>
        <span className="text-xs text-gray-300 pl-8">
          {mail.time && formatDateKST(mail.time)}
        </span>
      </div>
      <button
        onClick={onView}
        className="text-xs border border-green-500 text-green-600 rounded px-2 py-1 hover:bg-blue-50"
      >
        답변
        <br />
        열람
      </button>
    </div>
  );
}

// 🔹 type === 2 (가족 가입 요청)
export function Type2Notice({
  mail,
  onAccept,
  onDecline,
}: {
  mail: Notice;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 px-4">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-pink-100 text-pink-600">
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
        </div>
        <span className="text-sm text-gray-700">
          {mail.senderName ?? '누군가'}님이 가족 가입을 요청했어요
        </span>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onAccept}
          className="text-xs border border-blue-500 text-blue-600 rounded px-2 py-1 hover:bg-blue-50"
        >
          수락
        </button>
        <button
          onClick={onDecline}
          className="text-xs border border-red-500 text-red-500 rounded px-2 py-1 hover:bg-red-50"
        >
          거절
        </button>
      </div>
    </div>
  );
}

// 🔹 type === 3 (서버 점검 등)
export function Type3Notice() {
  return (
    <div className="flex items-center justify-between py-3 px-4">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600">
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
        </div>
        <span className="text-sm text-gray-700">서버 점검 공지</span>
      </div>
    </div>
  );
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
  const { setSelectedDate } = useDateStore();

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
    noticeId: number | null,
    senderId: number | null,
    subject: number | null,
    time: string | null,
  ) {
    if (!noticeId || !time) return;
    //+)notice 답변 열람 엔드포인트 호출 -> notice, readSubject 정보 바뀜
    const res = await Fetcher('/parent/openNotice', {
      method: 'POST',
      data: { noticeId: noticeId },
    });

    if (res.isSuccess) {
      console.log('메일 삭제 성공:', res.message);
    } else {
      console.error('메일 삭제 실패:', res.message);
    }

    //알람 업데이트, 알림창 닫아짐
    await fetchNoticeData(setNoticeData, setError);
    setOpen(false);

    //선택날짜 설정
    const date = time.split(' ')[0]; // "2025-08-12"

    const currentChildId = Number(params.childId);
    if (currentChildId !== senderId) {
      //해당 자식의 답변 열람 화면으로 이동, 자식 바뀌며 readSubject 자동 호출
      router.push(`/redirect/mailToSubject?target=/parent/${senderId}/home`);
    } else {
      //weekly router.refresh()로 readSubject 자동 호출
      emitter.emit('reloadReadData');
    }

    setSelectedDate(date);
    setSelectedSubjectId(subject);
    setShowPanels(true);
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

  const filteredNotices = noticeData?.notices
    ?.filter((mail) => !mail.accept)
    .sort((a, b) => b.noticeId - a.noticeId)
    .slice(0, 10);

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
  <div className="absolute z-10 mt-2 w-96 right-0 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto divide-y">
    {loading ? (
      <div className="p-4 text-sm text-gray-500">로딩 중...</div>
    ) : error ? (
      <div className="p-4 text-sm text-red-500">{error}</div>
    ) : !filteredNotices || filteredNotices.length === 0 ? (
      <div className="p-4 text-sm text-gray-500">새로운 알림이 없습니다.</div>
    ) : (
      <>
        {/* 🔹 type 2 먼저 렌더링 */}
        {filteredNotices
          .filter((mail) => mail.type === 2)
          .map((mail) => (
            <Type2Notice
              key={mail.noticeId}
              mail={mail}
              onAccept={() => handleAccept(mail.senderId)}
              onDecline={() => handleDecline(mail.senderId)}
            />
          ))}

        {/* type2가 있으면 구분선 추가 */}
        {filteredNotices.some((mail) => mail.type === 2) && <hr className="border-gray-200 my-1" />}

        {/* 🔹 나머지 type 1, 3 렌더링 */}
        {filteredNotices
          .filter((mail) => mail.type !== 2)
          .map((mail) =>
            mail.type === 1 ? (
              <Type1Notice
                key={mail.noticeId}
                mail={mail}
                onView={() =>
                  handleView(mail.noticeId, mail.senderId, mail.subject, mail.time)
                }
              />
            ) : (
              <Type3Notice key={mail.noticeId} />
            ),
          )}
      </>
    )}
  </div>
)}
    </div>
  );
}
