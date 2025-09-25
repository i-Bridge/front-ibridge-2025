

interface Notice {
  noticeId: number;
  type: 1 | 2 | 3;
  senderId: number | null;
  senderName: string | null;
  time: string;
  subject: number;
  accept: boolean;
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
        <span className="text-xs text-gray-300 pl-5">
          {mail.time && formatDateKST(mail.time)}
        </span>
      </div>
      <button
        onClick={onView}
        className="text-xs border bg-green-100 text-green-600 rounded px-1 py-1 hover:bg-blue-50"
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
          className="text-xs border bg-blue-100 text-blue-600 rounded px-1 py-1 hover:bg-blue-50"
        >
          수락
        </button>
        <button
          onClick={onDecline}
          className="text-xs border bg-red-100 text-red-500 rounded px-1 py-1 hover:bg-red-50"
        >
          거절
        </button>
      </div>
    </div>
  );
}

// 🔹 type === 3 (서버 점검)
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