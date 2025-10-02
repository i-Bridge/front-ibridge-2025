// koreanDateFormatter.ts
// 날짜 문자열(예: "2025-02-11") 또는 Date 객체를 받아
// 한국어 형식으로 "M월 D일 요일" 형태의 문자열을 반환합니다.
// 예: "2025-02-11" -> "2월 11일 화요일"

export type FormatOptions = {
  /** 요일 표기를 포함할지 여부 (기본: true) */
  withWeekday?: boolean;
  /** 요일을 약칭으로 표시할지 여부 (예: '화' 대신 '화요일') 기본: false */
  shortWeekday?: boolean;
  /** 입력이 유효하지 않을 때 반환할 기본 문자열 (기본: '') */
  fallback?: string;
};

const KOREAN_WEEKDAYS = [
  '일요일',
  '월요일',
  '화요일',
  '수요일',
  '목요일',
  '금요일',
  '토요일',
];

const KOREAN_WEEKDAYS_SHORT = ['일', '월', '화', '수', '목', '금', '토'];

function parseToDate(input: string | Date): Date | null {
  if (input instanceof Date) {
    if (Number.isNaN(input.getTime())) return null;
    return input;
  }

  if (typeof input !== 'string') return null;

  // 허용하는 문자열 형식들: YYYY-MM-DD, YYYY/MM/DD, YYYYMMDD
  const trimmed = input.trim();

  // YYYY-MM-DD 또는 YYYY/MM/DD
  const isoMatch = trimmed.match(/^(\d{4})[-\\/](\d{1,2})[-\\/](\d{1,2})$/);
  if (isoMatch) {
    const y = Number(isoMatch[1]);
    const m = Number(isoMatch[2]);
    const d = Number(isoMatch[3]);
    const dt = new Date(y, m - 1, d);
    if (dt && dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d) {
      return dt;
    }
    return null;
  }

  // YYYYMMDD
  const compactMatch = trimmed.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (compactMatch) {
    const y = Number(compactMatch[1]);
    const m = Number(compactMatch[2]);
    const d = Number(compactMatch[3]);
    const dt = new Date(y, m - 1, d);
    if (dt && dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d) {
      return dt;
    }
    return null;
  }

  // Date.parse 가능한 다른 형식 시도
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) return parsed;

  return null;
}

/**
 * 입력된 날짜를 한국어 형식으로 반환합니다.
 *
 * DateFormatter('2025-02-11') => '2월 11일 화요일'
 */
export default function DateFormatter(
  input: string | Date,
  options: FormatOptions = {},
): string {
  const { withWeekday = true, shortWeekday = false, fallback = '' } = options;
  const dt = parseToDate(input);
  if (!dt) return fallback;

  const month = dt.getMonth() + 1;
  const date = dt.getDate();
  const weekdayIdx = dt.getDay(); // 0(일) ~ 6(토)

  let result = `${month}월 ${date}일`;
  if (withWeekday) {
    result += ' ';
    result += shortWeekday ? `${KOREAN_WEEKDAYS_SHORT[weekdayIdx]}요일` : KOREAN_WEEKDAYS[weekdayIdx];
  }

  return result;
}