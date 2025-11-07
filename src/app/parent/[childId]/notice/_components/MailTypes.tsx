import { Text } from '@/ui/Text';
import { Button } from '@/ui/Button';
import { Type1NoticeIcon, Type2NoticeIcon, Type3NoticeIcon, Type4NoticeIcon } from '@/ui/icon/icon';
interface Notice {
  noticeId: number;
  type: 1 | 2 | 3 | 4;
  senderId: number | null;
  senderName: string | null;
  time: string;
  subject: number;
  accept: boolean;
}

// 🔹 type === 1 (답변 완료) - Figma 디자인 적용
export function Type1Notice({
  mail,
  onView,
}: {
  mail: Notice;
  onView: () => void;
}) {
  return (
    // Figma: Outer container
    <div className="self-stretch px-7 py-5 bg-white rounded-xl  border border-1 border-grayscale-gray20 inline-flex justify-start items-center gap-4">
      <Type1NoticeIcon />

      {/* Figma: Text block (flex-1) */}
      <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
        <Text variant={'body04'} className="">
          {/* 동적 데이터 매핑 */}
          {mail.senderName ?? '자녀'}(이)가 답변을 완료했어요.
        </Text>

        {/* 동적 데이터 매핑 */}
        {mail.time && formatDateKST(mail.time)}
      </div>

      {/* Figma: Button (div -> button 태그로 변경) */}

      <Button
        onClick={onView}
        variant={'grayscale'}
        textVariant={'caption04'}
        textClass="text-grayscale-gray70"
        className="h-10 px-4 py-2.5 bg-grayscale-gray5 w-auto"
      >
        {/* Figma 디자인에 맞춰 '열람' 텍스트로 변경 */}
        열람
      </Button>
    </div>
  );
}
// 🔹 type === 2 (가족 가입 요청) - Figma 디자인 적용
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
    // Figma: Outer container
    <div className="self-stretch px-7 py-5 bg-white rounded-xl  border border-1 border-grayscale-gray20 inline-flex justify-start items-center gap-4">
      {/* Figma: Icon container */}
      <Type2NoticeIcon />

      {/* Figma: Text block (flex-1) */}
      <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
        <Text variant={'body04'}>
          {/* 동적 데이터 매핑 */}
          {mail.senderName ?? '누군가'} 님이 가족 가입을 요청했어요.
        </Text>

        {/* 동적 데이터 매핑 */}
        {mail.time && formatDateKST(mail.time)}
      </div>

      {/* Button container */}
      <div className="flex justify-start items-center gap-2">
        <Button
          onClick={onDecline}
          variant={'grayscale'}
          textVariant={'caption04'}
          textClass="text-grayscale-gray70"
          className="h-10 px-4 py-2.5 bg-grayscale-gray5"
        >
          거절
        </Button>
        <Button
          onClick={onAccept}
          variant={'grayscale'}
          textVariant={'caption04'}
          textClass="text-grayscale-gray70"
          className="h-10 px-4 py-2.5 bg-grayscale-gray5"
        >
          수락
        </Button>
      </div>
    </div>
  );
}

// 🔹 type === 3 (포도송이 수확) - Figma 디자인 적용
export function Type3Notice({ mail }: { mail: Notice }) {
  return (
    // Figma: Outer container (opacity-40 제거하여 일반 버전으로 변경)
    <div className="self-stretch px-7 py-5 bg-white rounded-xl  border border-1 border-grayscale-gray20 inline-flex justify-start items-center gap-4">
      {/* Figma: Icon container */}
      <Type3NoticeIcon />

      {/* Figma: Text block (flex-1) */}
      <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
        <Text variant={'body04'}>
          {/* 동적 데이터 매핑 */}
          {mail.senderName ?? '자녀'}(이)가 포도알 한송이를 받았어요.
        </Text>
        {/* 동적 데이터 매핑 */}
        {mail.time && formatDateKST(mail.time)}
      </div>
    </div>
  );
}
// 🔹 type === 4 (분석 결과 업데이트) - Figma 디자인 적용
export function Type4Notice({ mail }: { mail: Notice }) {
  return (
    // Figma: Outer container (opacity-40 제거하여 일반 버전으로 변경)
    <div className="self-stretch px-7 py-5 bg-white rounded-xl  border border-1 border-grayscale-gray20 inline-flex justify-start items-center gap-4">
      {/* Figma: Icon container */}
      <Type4NoticeIcon />

      {/* Figma: Text block (flex-1) */}
      <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
        <Text variant={'body04'}>
          {/* 동적 데이터 매핑: 
            기존 "분석 결과" 대신 Figma의 "대시보드" 텍스트를 사용하되, 
            누구의 것인지 알 수 있도록 senderName은 유지
          */}
          {mail.senderName ?? '자녀'}의 대시보드가 업데이트 됐어요.
        </Text>

        {mail.time && formatDateKST(mail.time)}
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
    <Text variant={'body05'} className=" text-grayscale-gray50">
      {dayText} {timeText}
    </Text>
  );
}
